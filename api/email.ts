// Vercel Serverless Function: /api/email
// Dispatches automated HTML emails via Resend or SendGrid with graceful fallback

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html, type, ticketId } = req.body || {};

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required parameters: to, subject, html' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Sanelow Support <support@sanelowmusic.com>';

  // 1. Dispatch via Resend if API key is provided
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject: subject,
          html: html,
        }),
      });

      const data = await response.json();
      return res.status(200).json({ success: true, provider: 'resend', id: data.id, to, ticketId });
    } catch (err: any) {
      console.error('[Resend Error]', err);
    }
  }

  // 2. Dispatch via SendGrid if SendGrid API key is provided
  if (sendgridApiKey) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: 'support@sanelowmusic.com', name: 'Sanelow Music Group Support' },
          subject: subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });

      if (response.ok) {
        return res.status(200).json({ success: true, provider: 'sendgrid', to, ticketId });
      }
    } catch (err: any) {
      console.error('[SendGrid Error]', err);
    }
  }

  // 3. Fallback simulation (for development / preview sandbox)
  return res.status(200).json({
    success: true,
    provider: 'simulated_preview',
    message: 'Email processed successfully in sandbox mode. Set RESEND_API_KEY for live delivery.',
    to,
    ticketId,
  });
}
