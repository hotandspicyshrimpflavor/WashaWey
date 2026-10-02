/**
 * Cloudflare Worker — WashaWey Tech Repair
 *
 * Routes:
 *   POST /api/email       → forwards quote submissions to Resend
 *   OPTIONS /api/email    → CORS preflight
 *   GET  *                → serves static assets (env.ASSETS)
 *
 * Env vars (set in Cloudflare dashboard → Workers & Pages → WashaWey → Settings → Variables):
 *   RESEND_API_KEY  — required. Get from https://resend.com/api-keys
 *   MAIL_TO         — optional override, defaults to "repair@washawey.com"
 *   MAIL_FROM       — optional override, defaults to "WashaWey <noreply@washawey.com>"
 *
 * Deploy: `wrangler deploy` (from this repo root)
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });

function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function handleEmail(request, env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { name, email, device, message } = body || {};
  if (!name || !email || !message) {
    return json({ error: 'Missing required fields: name, email, message' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Invalid email address' }, 400);
  }
  if (String(message).length > 5000) {
    return json({ error: 'Message too long (max 5000 chars)' }, 400);
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[email] RESEND_API_KEY is not set in Worker env');
    return json({ error: 'Email service is not configured' }, 500);
  }

  const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  const subject = `New WashaWey Quote: ${name}${device ? ' — ' + device : ''}`;

  const emailHtml = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#f5f5f5;background:#0D0D0D;padding:24px;max-width:600px;">
      <h1 style="color:#F59E0B;margin:0 0 16px;">New Quote Request — WashaWey</h1>
      <p style="color:#a3a3a3;margin:0 0 20px;">Submitted via washawey.com contact form</p>
      <table style="width:100%;border-collapse:collapse;color:#f5f5f5;">
        <tr><td style="padding:6px 12px;color:#a3a3a3;width:140px;">Customer</td><td style="padding:6px 12px;font-weight:600;">${esc(name)}</td></tr>
        <tr><td style="padding:6px 12px;color:#a3a3a3;">Email</td><td style="padding:6px 12px;"><a href="mailto:${esc(email)}" style="color:#F59E0B;">${esc(email)}</a></td></tr>
        ${device ? `<tr><td style="padding:6px 12px;color:#a3a3a3;">Device</td><td style="padding:6px 12px;">${esc(device)}</td></tr>` : ''}
      </table>
      <hr style="border:0;border-top:1px solid #262626;margin:20px 0;">
      <h3 style="color:#F59E0B;margin:0 0 8px;">Issue / Details</h3>
      <p style="margin:0;white-space:pre-wrap;">${esc(message).replace(/\n/g, '<br>')}</p>
      <hr style="border:0;border-top:1px solid #262626;margin:20px 0;">
      <p style="color:#737373;font-size:12px;margin:0;">
        Submitted ${esc(submittedAt)} PT<br>
        Source: washawey.com contact form
      </p>
    </div>`.trim();

  let resendRes;
  try {
    resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.MAIL_FROM || 'WashaWey <noreply@washawey.com>',
        to: [env.MAIL_TO || 'repair@washawey.com'],
        reply_to: email,
        subject,
        html: emailHtml,
      }),
    });
  } catch (err) {
    console.error('[email] Resend fetch failed:', err);
    return json({ error: 'Failed to reach email service' }, 502);
  }

  let result;
  try {
    result = await resendRes.json();
  } catch {
    result = { message: resendRes.statusText };
  }

  if (!resendRes.ok) {
    console.error('[email] Resend returned', resendRes.status, JSON.stringify(result));
    return json(
      { error: 'Email service rejected the request', detail: result.message || result.error },
      resendRes.status,
    );
  }

  return json({ ok: true, id: result.id });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/email') {
      return handleEmail(request, env);
    }

    // Everything else → static assets
    return env.ASSETS.fetch(request);
  },
};
