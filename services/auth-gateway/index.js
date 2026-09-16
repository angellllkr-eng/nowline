import crypto from 'node:crypto';
import express from 'express';

const app = express();
app.use(express.json({ limit: '16kb' }));
const port = Number(process.env.PORT || 8080);
const issuer = process.env.OIDC_ISSUER;
const clientId = process.env.OIDC_CLIENT_ID;
const redirectUri = process.env.OIDC_REDIRECT_URI || 'https://dev.nowline.angelk.com/auth/callback';
const stateStore = new Map();
const stateTtlMs = 300000;

function base64url(buffer) { return buffer.toString('base64').replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', ''); }
function pkceVerifier() { return base64url(crypto.randomBytes(32)); }
async function challenge(verifier) { return base64url(crypto.createHash('sha256').update(verifier).digest()); }
function setSession(res, value) { res.setHeader('Set-Cookie', `nowline_session=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`); }
function configured() { return Boolean(issuer && clientId && process.env.OIDC_CLIENT_SECRET); }

app.get('/healthz', (_req, res) => res.json({ ok: true, service: 'auth-gateway', configured: configured() }));
app.get('/auth/start', async (_req, res) => {
  if (!configured()) return res.status(503).json({ error: 'oidc_not_configured' });
  const state = base64url(crypto.randomBytes(24));
  const verifier = pkceVerifier();
  stateStore.set(state, { verifier, createdAt: Date.now() });
  const codeChallenge = await challenge(verifier);
  const url = new URL(`${issuer.replace(/\/$/, '')}/authorize`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', 'openid profile email');
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  res.redirect(url.toString());
});

app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  const record = stateStore.get(state);
  stateStore.delete(state);
  if (!code || !record || Date.now() - record.createdAt > stateTtlMs) return res.status(400).json({ error: 'invalid_pkce_state' });
  if (!configured()) return res.status(503).json({ error: 'oidc_not_configured' });
  try {
    const tokenResponse = await fetch(`${issuer.replace(/\/$/, '')}/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', code: String(code), redirect_uri: redirectUri, client_id: clientId, client_secret: process.env.OIDC_CLIENT_SECRET, code_verifier: record.verifier })
    });
    if (!tokenResponse.ok) return res.status(401).json({ error: 'oidc_token_exchange_failed' });
    const tokens = await tokenResponse.json();
    if (!tokens.access_token) return res.status(401).json({ error: 'oidc_missing_access_token' });
    setSession(res, tokens.access_token);
    res.redirect('/hall');
  } catch (error) {
    console.error(JSON.stringify({ event: 'auth_callback_error', message: error.message }));
    res.status(502).json({ error: 'oidc_unavailable' });
  }
});

app.listen(port, () => console.log(`auth-gateway listening on ${port}`));
