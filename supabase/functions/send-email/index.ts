import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from 'npm:resend';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

type EmailType = 'newsletter_welcome' | 'community_welcome' | 'contact_confirmation' | 
                 'contact_notification' | 'workshop_update' | 'payment_success' | 
                 'resume_request' | 'project_request' | 'ppt_request';

interface RequestData {
  name?: string;
  service?: string;
  amount?: string;
  transactionId?: string;
  role?: string;
  experience?: string;
  title?: string;
  description?: string;
  topic?: string;
  brief?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface EmailRequest {
  type: EmailType;
  to: string;
  requestData?: RequestData;
}

interface EmailTemplateData {
  subject: string;
  body: string;
}

function createEmailBody(lines: string[]): string {
  return lines.filter(Boolean).join('\n');
}

function getEmailTemplate(type: EmailType, data: RequestData): EmailTemplateData {
  switch (type) {
    case 'payment_success':
      return {
        subject: 'Payment Confirmed - InnovBridge Service Request',
        body: createEmailBody([
          `Dear ${data.name || 'Valued Customer'},`,
          '',
          `Thank you for your payment for the ${data.service || 'requested'} service at InnovBridge.`,
          'Your request has been successfully processed.',
          '',
          data.amount ? `Amount Paid: ${data.amount}` : '',
          data.transactionId ? `Transaction ID: ${data.transactionId}` : '',
          '',
          'We will process your request and get back to you shortly with the next steps.',
          '',
          'If you have any questions, feel free to reach out to us at hello@innovbridge.tech.',
          '',
          'Best regards,',
          'The InnovBridge Team'
        ])
      };

    case 'resume_request':
      return {
        subject: 'Resume Creation Request Received - InnovBridge',
        body: createEmailBody([
          `Dear ${data.name || 'Valued Customer'},`,
          '',
          'We have received your resume creation request.',
          'Our team will start working on your professional resume shortly.',
          '',
          'Details provided:',
          data.role ? `Role: ${data.role}` : '',
          data.experience ? `Experience Level: ${data.experience}` : '',
          '',
          'We aim to deliver your custom-tailored resume within 2-3 business days.',
          'You will receive updates on the progress via email.',
          '',
          'Need to discuss specifics? Reply to this email or reach out to hello@innovbridge.tech.',
          '',
          'Best regards,',
          'The InnovBridge Team'
        ])
      };

    case 'project_request':
      return {
        subject: 'Project Builder Request Confirmed - InnovBridge',
        body: createEmailBody([
          `Dear ${data.name || 'Valued Customer'},`,
          '',
          'Your project build request has been received and confirmed.',
          '',
          'Project Details:',
          data.title ? `Title: ${data.title}` : '',
          data.description ? `Description: ${data.description}` : '',
          '',
          'Our development team will review your requirements and reach out within 24 hours',
          'to discuss the next steps and timeline.',
          '',
          'For any immediate questions, contact us at hello@innovbridge.tech.',
          '',
          'Best regards,',
          'The InnovBridge Team'
        ])
      };

    case 'ppt_request':
      return {
        subject: 'Presentation Creation Request - InnovBridge',
        body: createEmailBody([
          `Dear ${data.name || 'Valued Customer'},`,
          '',
          'We have received your request for a professional presentation.',
          '',
          'Presentation Details:',
          data.topic ? `Topic: ${data.topic}` : '',
          data.brief ? `Brief: ${data.brief}` : '',
          '',
          'Our design team will start working on your presentation',
          'and deliver a draft within 2-3 business days.',
          '',
          'Questions or additional requirements? Email us at hello@innovbridge.tech.',
          '',
          'Best regards,',
          'The InnovBridge Team'
        ])
      };

    case 'newsletter_welcome':
      return {
        subject: 'Welcome to InnovBridge Newsletter!',
        body: createEmailBody([
          `Dear ${data.name || 'Innovator'},`,
          '',
          'Welcome to the InnovBridge newsletter!',
          'We are excited to have you join our community of tech enthusiasts and innovators.',
          '',
          'You will receive regular updates about:',
          '- Latest tech trends and innovations',
          '- Industry insights and best practices',
          '- Exclusive opportunities and events',
          '- Community highlights and success stories',
          '',
          'Stay connected with us on our journey to shape the future of technology.',
          '',
          'Best regards,',
          'The InnovBridge Team',
          'hello@innovbridge.tech'
        ])
      };

    case 'community_welcome':
      return {
        subject: 'Welcome to InnovBridge Community!',
        body: createEmailBody([
          `Dear ${data.name || 'Innovation Champion'},`,
          '',
          'Welcome to the InnovBridge community!',
          'We are thrilled to have you join our global network of innovators.',
          '',
          'You are now part of a dynamic community where you can:',
          '- Connect with fellow innovators',
          '- Share your expertise and insights',
          '- Access exclusive resources and events',
          '- Collaborate on groundbreaking projects',
          '',
          'Let us innovate together!',
          '',
          'Best regards,',
          'The InnovBridge Team',
          'hello@innovbridge.tech'
        ])
      };

    case 'contact_confirmation':
      return {
        subject: "We've Received Your Message - InnovBridge",
        body: createEmailBody([
          `Dear ${data.name || 'Valued Customer'},`,
          '',
          'Thank you for reaching out to InnovBridge.',
          'We have received your message and will get back to you shortly.',
          '',
          'Your Message Details:',
          data.subject ? `Subject: ${data.subject}` : '',
          data.message ? `Message: ${data.message}` : '',
          '',
          'We typically respond within 24-48 hours.',
          '',
          'Best regards,',
          'The InnovBridge Team',
          'hello@innovbridge.tech'
        ])
      };

    case 'contact_notification':
      return {
        subject: 'New Contact Form Submission - InnovBridge',
        body: createEmailBody([
          'New contact form submission received:',
          '',
          `From: ${data.name || 'Not provided'} (${data.email || 'No email'})`,
          `Subject: ${data.subject || 'Not provided'}`,
          `Message: ${data.message || 'No message'}`
        ])
      };

    case 'workshop_update':
      return {
        subject: 'Workshop Update - InnovBridge',
        body: createEmailBody([
          `Dear ${data.name || 'Participant'},`,
          '',
          data.message || 'There has been an update regarding your workshop registration.',
          '',
          'If you have any questions, please do not hesitate to contact us at hello@innovbridge.tech.',
          '',
          'Best regards,',
          'The InnovBridge Team'
        ])
      };

    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, to, requestData = {} } = await req.json() as EmailRequest;

    if (!type || !to) {
      throw new Error('Missing required fields: type and to are required');
    }

    const template = getEmailTemplate(type, requestData);

    try {
      const { data, error } = await resend.emails.send({
        from: 'InnovBridge <hello@innovbridge.tech>',
        to: [to],
        subject: template.subject,
        text: template.body,
      });

      if (error) {
        console.error('Error sending email:', error);
        throw error;
      }

      return new Response(
        JSON.stringify({ success: true, id: data?.id }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});