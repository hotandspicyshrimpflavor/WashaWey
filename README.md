# WashaWey Tech Repair — Website

Static single-page site served by a Cloudflare Worker that handles the `/api/email` form endpoint via Resend.

## Stack
- Static HTML/CSS/JS (vanilla, no framework, no build step)
- Cloudflare Worker (`worker.js`) as entry point — serves `env.ASSETS` for everything except `/api/email`
- Resend for transactional email
- Cloudflare DNS for the apex domain

## Project layout
```
.
├── index.html              # the page (markup + inline form handler + animations)
├── worker.js               # Cloudflare Worker — POST /api/email handler
├── wrangler.jsonc          # Worker config (entry: worker.js, assets: .)
├── _headers                # Cloudflare Pages headers (CSP, HSTS, etc.)
├── robots.txt
├── sitemap.xml
├── manifest.json
├── favicon.svg
├── imgs/                   # JPEG images (already optimized)
├── videos/
└── marketing/              # social-media post templates — NOT served as site assets
```

## Setup

### 1. Get a Resend API key
Sign up at https://resend.com, verify `washawey.com` (DKIM record already exists), create an API key with **Sending access** permission scoped to this domain.

### 2. Set env vars on the Worker
In Cloudflare dashboard → Workers & Pages → WashaWey → Settings → Variables:
- `RESEND_API_KEY` — your key (encrypt it)

### 3. Deploy
```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

### 4. Point the apex domain at the Worker
DNS already has a Worker-routed AAAA record. If you ever reset it, recreate the apex record and route it via the worker.

## Local dev
```bash
cp .dev.vars.example .dev.vars
# edit .dev.vars with your real Resend key
wrangler dev
# open http://localhost:8787
```

## Contact form endpoint
`POST /api/email` accepts JSON:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "device": "MSI laptop, screen flickering",
  "message": "Started yesterday, sometimes goes black for a second."
}
```
Returns `200 {ok:true, id:"..."}` on success, `4xx/5xx {error, detail}` on failure.

## Security
- All security headers via `_headers`
- API key is in Worker env vars (NOT in source code)
- HTML email template escapes all user input
- Cloudflare bot protection handles abusive traffic
