import crypto from 'node:crypto';
import express from 'express';

const app = express();
app.use(express.raw({ type: '*/*', limit: '256kb' }));
const secret = process.env.ZAPIER_WEBHOOK_SECRET;
const slackUrl = process.env.SLACK_WEBHOOK_URL;
const pagerDutyUrl = process.env.PAGERDUTY_EVENTS_URL;

function validHmac(raw, signature) {
  if (!secret || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  const provided = signature.replace(/^sha256=/, '');
  try { return provided.length === expected.length && crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected)); }
  catch { return false; }
}

async function forward(url, body) {
  if (!url) return;
  await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
}

app.get('/healthz', (_req, res) => res.json({ ok: true, service: 'mcp', configured: Boolean(secret) }));
app.post('/mcp/webhook', async (req, res) => {
  const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));
  if (!validHmac(raw, req.header('x-nowline-signature'))) return res.status(401).json({ error: 'invalid_signature' });
  let event;
  try { event = JSON.parse(raw.toString('utf8') || '{}'); }
  catch { return res.status(400).json({ error: 'invalid_json' }); }
  const envelope = { source: 'zapier-mcp', event, received_at: new Date().toISOString() };
  try {
    await Promise.all([
      forward(slackUrl, { text: `Nowline event: ${event.type || 'unknown'}`, ...envelope }),
      forward(pagerDutyUrl, { routing_key: process.env.PAGERDUTY_ROUTING_KEY, event_action: 'trigger', payload: { summary: `Nowline ${event.type || 'event'}`, severity: 'warning', source: 'nowline-mcp', custom_details: event } })
    ]);
    console.log(JSON.stringify(envelope));
    res.status(202).json({ accepted: true });
  } catch (error) {
    console.error(JSON.stringify({ event: 'mcp_forward_error', message: error.message }));
    res.status(502).json({ error: 'forward_failed' });
  }
});

app.listen(Number(process.env.PORT || 8080), () => console.log('mcp listening'));
