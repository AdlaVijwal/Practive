import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

// Validate environment variables
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!stripeKey) throw new Error('Missing STRIPE_SECRET_KEY')
if (!supabaseUrl) throw new Error('Missing SUPABASE_URL')
if (!supabaseKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')

const stripe = new Stripe(stripeKey, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseClient = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const session_id = url.searchParams.get('session_id')
    const request_id = url.searchParams.get('request_id')

    if (!session_id || !request_id) {
      console.error('Missing session_id or request_id')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing session_id or request_id',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Verify the payment with Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id)
    const isPaid = session.payment_status === 'paid'

    // Get the request details from the database
    const { data: requestData, error: requestError } = await supabaseClient
      .from('student_requests')
      .select('*')
      .eq('id', request_id)
      .single()

    if (requestError) {
      console.error('Error fetching request:', requestError)
      throw requestError
    }

    if (!isPaid) {
      console.error('Payment not confirmed:', session.payment_status)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Payment not confirmed',
          paid: false,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Update the database
    const { error: updateError } = await supabaseClient
      .from('student_requests')
      .update({ paid: true })
      .eq('id', request_id)

    if (updateError) {
      console.error('Error updating payment status:', updateError)
      throw updateError
    }

    // Send confirmation email
    try {
      const amount = (session.amount_total ? session.amount_total / 100 : 0).toFixed(2)
      
      // First send payment confirmation
      await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'payment_success',
          to: requestData.email,
          name: requestData.data?.name,
          requestData: {
            service: requestData.request_type,
            amount: `$${amount}`,
            transactionId: session_id
          }
        })
      })

      // Then send service-specific email
      await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: `${requestData.request_type}_request`,
          to: requestData.email,
          requestData: requestData.data
        })
      })
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Don't throw here - we don't want to fail the response if just the email fails
    }    // Add entry to request history
    const { error: historyError } = await supabaseClient
      .from('student_request_history')
      .insert({
        request_id,
        status: 'processing',
        notes: 'Payment confirmed via Stripe',
      })

    if (historyError) {
      console.error('History insert error:', historyError)
      // Non-blocking error - continue with success response
    }

    // Send confirmation email
    try {
      const { data: requestData } = await supabaseClient
        .from('student_requests')
        .select('email, request_type, data')
        .eq('id', request_id)
        .single()

      if (requestData) {
        await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: requestData.email,
              type: 'payment_confirmation',
              data: {
                request_type: requestData.request_type,
                details: requestData.data,
              },
            }),
          }
        )
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Non-blocking error - continue with success response
    }

    return new Response(
      JSON.stringify({
        success: true,
        paid: true,
        message: 'Payment confirmed and request updated',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('General error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})