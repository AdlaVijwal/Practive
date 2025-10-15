import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  type: 'newsletter_welcome' | 'community_welcome' | 'contact_confirmation' | 'contact_notification';
  to: string;
  name?: string;
  subject?: string;
  message?: string;
}

const SMTP_CONFIG = {
  user: 'hello@innovbridge.tech',
  pass: 'DEB6237C127EE6E469CA4F23EFF57C3DF07358CA28EAAE5693ABBEDD10ODE4A6F530C6F883BC5C7290D3D89F858A0D77',
};

function getEmailTemplate(type: string, data: any): { subject: string; html: string } {
  const templates: Record<string, any> = {
    newsletter_welcome: {
      subject: 'Welcome to InnovBridge 🌐',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #000; color: #fff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%); border: 2px solid #0ea5e9; border-radius: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); padding: 40px 20px; text-align: center; border-radius: 18px 18px 0 0; }
            .header h1 { margin: 0; font-size: 32px; color: #fff; text-shadow: 0 0 20px rgba(6, 182, 212, 0.5); }
            .content { padding: 40px 30px; }
            .content h2 { color: #06b6d4; margin-bottom: 20px; }
            .content p { line-height: 1.8; color: #d1d5db; margin-bottom: 15px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: #fff; text-decoration: none; border-radius: 10px; font-weight: bold; margin: 20px 0; }
            .footer { padding: 30px; text-align: center; color: #6b7280; border-top: 1px solid #374151; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to InnovBridge</h1>
            </div>
            <div class="content">
              <h2>Hello, Innovator! 👋</h2>
              <p>Thank you for subscribing to the InnovBridge newsletter. We're thrilled to have you join our global community of tech enthusiasts, innovators, and visionaries!</p>
              <p><strong>What you'll receive:</strong></p>
              <ul style="color: #d1d5db; line-height: 1.8;">
                <li>🚀 Daily/Weekly tech updates and AI breakthroughs</li>
                <li>💼 Exclusive job opportunities and internships</li>
                <li>🔧 Digital transformation insights and tools</li>
                <li>🌐 Innovation stories from around the world</li>
              </ul>
              <p>Stay ahead of the curve with cutting-edge technology news delivered right to your inbox.</p>
              <a href="https://innovbridge.tech" class="button">Visit InnovBridge</a>
              <p style="margin-top: 30px;"><em>"We're not just building a platform—we're cultivating a community of innovators who will shape the future."</em></p>
              <p><strong>— Adla Vijwal, Founder of InnovBridge</strong></p>
            </div>
            <div class="footer">
              <p>InnovBridge.tech | Building the Bridge to the Next Era of Technology</p>
              <p>Contact us: <a href="mailto:hello@innovbridge.tech" style="color: #06b6d4;">hello@innovbridge.tech</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    community_welcome: {
      subject: 'Welcome to the InnovBridge Community 🚀',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #000; color: #fff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%); border: 2px solid #06b6d4; border-radius: 20px; }
            .header { background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%); padding: 40px 20px; text-align: center; border-radius: 18px 18px 0 0; }
            .header h1 { margin: 0; font-size: 32px; color: #fff; text-shadow: 0 0 20px rgba(6, 182, 212, 0.5); }
            .content { padding: 40px 30px; }
            .content h2 { color: #06b6d4; margin-bottom: 20px; }
            .content p { line-height: 1.8; color: #d1d5db; margin-bottom: 15px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%); color: #fff; text-decoration: none; border-radius: 10px; font-weight: bold; margin: 20px 0; }
            .footer { padding: 30px; text-align: center; color: #6b7280; border-top: 1px solid #374151; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>You're In! 🎉</h1>
            </div>
            <div class="content">
              <h2>Welcome to the InnovBridge Community!</h2>
              <p>Congratulations on joining a global network of innovators, creators, and tech enthusiasts. Together, we're shaping the future of technology.</p>
              <p><strong>As a community member, you get:</strong></p>
              <ul style="color: #d1d5db; line-height: 1.8;">
                <li>🌟 Early access to new features and updates</li>
                <li>🤝 Networking with like-minded innovators</li>
                <li>📚 Free resources and learning materials</li>
                <li>🎯 Priority notifications for opportunities</li>
              </ul>
              <p>We're excited to have you with us on this journey to democratize technology and innovation.</p>
              <a href="https://innovbridge.tech#community" class="button">Explore Community</a>
              <p style="margin-top: 30px;">Stay connected, stay innovative!</p>
              <p><strong>The InnovBridge Team</strong></p>
            </div>
            <div class="footer">
              <p>InnovBridge.tech | Building the Bridge to the Next Era of Technology</p>
              <p>Contact us: <a href="mailto:hello@innovbridge.tech" style="color: #06b6d4;">hello@innovbridge.tech</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    contact_confirmation: {
      subject: 'We received your message - InnovBridge',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; background: #000; color: #fff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%); border: 2px solid #0ea5e9; border-radius: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); padding: 40px 20px; text-align: center; border-radius: 18px 18px 0 0; }
            .header h1 { margin: 0; font-size: 28px; color: #fff; }
            .content { padding: 40px 30px; }
            .content h2 { color: #06b6d4; margin-bottom: 20px; }
            .content p { line-height: 1.8; color: #d1d5db; margin-bottom: 15px; }
            .footer { padding: 30px; text-align: center; color: #6b7280; border-top: 1px solid #374151; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Reaching Out!</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.name || 'there'},</h2>
              <p>We've received your message and our team will review it shortly. We typically respond within 24 hours.</p>
              <p><strong>Your message:</strong></p>
              <p style="background: rgba(6, 182, 212, 0.1); padding: 20px; border-left: 3px solid #06b6d4; border-radius: 5px;">
                <strong>Subject:</strong> ${data.subject || 'N/A'}<br><br>
                ${data.message || 'N/A'}
              </p>
              <p>In the meantime, feel free to explore our latest tech updates and opportunities on our website.</p>
              <p>Best regards,<br><strong>The InnovBridge Team</strong></p>
            </div>
            <div class="footer">
              <p>InnovBridge.tech | hello@innovbridge.tech</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    contact_notification: {
      subject: `New Contact Message from ${data.name || 'Unknown'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: #f3f4f6; color: #1f2937; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 30px; }
            .header { background: #0ea5e9; color: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .field { margin-bottom: 15px; }
            .field strong { color: #0ea5e9; }
            .message-box { background: #f9fafb; padding: 20px; border-left: 4px solid #0ea5e9; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="field"><strong>Name:</strong> ${data.name || 'N/A'}</div>
            <div class="field"><strong>Email:</strong> ${data.to || 'N/A'}</div>
            <div class="field"><strong>Subject:</strong> ${data.subject || 'N/A'}</div>
            <div class="message-box">
              <strong>Message:</strong><br><br>
              ${data.message || 'N/A'}
            </div>
            <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">Respond to this inquiry by replying to ${data.to}</p>
          </div>
        </body>
        </html>
      `,
    },
  };

  return templates[type] || { subject: 'InnovBridge', html: '<p>Email from InnovBridge</p>' };
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const boundary = '----InnovBridgeBoundary' + Date.now();
    const mailBody = [
      `From: InnovBridge <${SMTP_CONFIG.user}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      html,
      `--${boundary}--`,
    ].join('\r\n');

    const response = await fetch(`https://api.elasticemail.com/v2/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        apikey: SMTP_CONFIG.pass,
        from: SMTP_CONFIG.user,
        to: to,
        subject: subject,
        bodyHtml: html,
        fromName: 'InnovBridge',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { type, to, name, subject, message }: EmailRequest = await req.json();

    const template = getEmailTemplate(type, { name, subject, message, to });
    const sent = await sendEmail(to, template.subject, template.html);

    if (type === 'contact_notification') {
      await sendEmail(
        SMTP_CONFIG.user,
        template.subject,
        template.html
      );
    }

    return new Response(
      JSON.stringify({ success: sent, message: sent ? 'Email sent successfully' : 'Failed to send email' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});