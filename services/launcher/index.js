import crypto from 'node:crypto';
import express from 'express';
import { importPKCS8, SignJWT } from 'jose';
import { resolveLanguage } from '../routing/language-router.js';

const app = express();
app.use(express.json({ limit: '32kb' }));
const port = Number(process.env.PORT || 8080);
const issuer = process.env.LAUNCH_ISSUER || 'https://dev.nowline.angelk.com';
const audience = process.env.LAUNCH_AUDIENCE || 'nowline-launcher';
const ttl = Number(process.env.LAUNCH_TTL_SECONDS || 120);
const privateKeyPem = process.env.LAUNCHER_PRIVATE_KEY;
const blocked = () => process.env.LAUNCH_BLOCKED === 'true';

function audit(actor, action, planId) {
  console.log(JSON.stringify({ actor, action, timestamp: new Date().toISOString(), plan_id: planId || null }));
}

function languageCookie(cookieHeader) {
  const item = String(cookieHeader || '').split(';').map((part) => part.trim()).find((part) => part.startsWith('a11-language='));
  return item ? item.slice('a11-language='.length) : null;
}

app.get('/healthz', (_req, res) => res.json({ ok: true, service: 'launcher', blocked: blocked() }));
app.get('/routing/language', (req, res) => {
  const language = resolveLanguage({ explicit: req.query.lang, cookie: languageCookie(req.headers.cookie), acceptLanguage: req.headers['accept-language'] });
  res.set('Cache-Control', 'private, max-age=300');
  res.json({ language, source: req.query.lang ? 'explicit' : 'request' });
});

app.post('/launcher/request', async (req, res) => {
  try {
    if (blocked()) return res.status(423).json({ error: 'launches_blocked' });
    if (!privateKeyPem) return res.status(503).json({ error: 'launcher_not_configured' });
    const { actor = 'session', plan_id = 'demo', destination = '/hall' } = req.body || {};
    const key = await importPKCS8(privateKeyPem, 'RS256');
    const jti = crypto.randomUUID();
    const token = await new SignJWT({ plan_id, destination, scope: 'launch' })
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT', kid: process.env.LAUNCH_KEY_ID || 'nowline-launch-1' })
      .setIssuer(issuer).setAudience(audience).setSubject(actor).setJti(jti)
      .setIssuedAt().setExpirationTime(`${ttl}s`).sign(key);
    audit(actor, 'launch.request', plan_id);
    const hall = process.env.HALL_URL || 'https://dev.nowline.angelk.com/hall';
    res.json({ launch_url: `${hall}?token=${encodeURIComponent(token)}`, token, expires_in: ttl });
  } catch (error) {
    console.error(JSON.stringify({ event: 'launcher_error', message: error.message }));
    res.status(500).json({ error: 'launch_failed' });
  }
});

app.listen(port, () => console.log(`launcher listening on ${port}`));
