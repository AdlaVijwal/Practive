import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

// Validate environment variables
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const siteUrl = Deno.env.get('SITE_URL')

if (!stripeKey) throw new Error('Missing STRIPE_SECRET_KEY')
if (!supabaseUrl) throw new Error('Missing SUPABASE_URL')
if (!supabaseKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
if (!siteUrl) throw new Error('Missing SITE_URL')

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
    const { email, request_type, data } = await req.json()

    if (!email || !request_type || !data) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Insert provisional request
    const { data: request, error: dbError } = await supabaseClient
      .from('student_requests')
      .insert({
        email,
        request_type,
        data,
        paid: false,
      })
      .select()
      .single()

    if (dbError || !request) {
      console.error('DB insert error:', dbError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create request' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${request_type.charAt(0).toUpperCase() + request_type.slice(1)} Service`,
              description: 'InnovBridge Student Service',
            },
            unit_amount: 200, // $2.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${Deno.env.get('SITE_URL')}?session_id={CHECKOUT_SESSION_ID}&request_id=${request.id}`,
      cancel_url: `${Deno.env.get('SITE_URL')}`,
    })

    // Update request with session ID
    const { error: updateError } = await supabaseClient
      .from('student_requests')
      .update({ stripe_session_id: session.id })
      .eq('id', request.id)

    if (updateError) {
      console.error('Failed to update session ID:', updateError)
    }

    return new Response(
      JSON.stringify({ success: true, url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})