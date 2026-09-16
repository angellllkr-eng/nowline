import express from 'express';
import Stripe from 'stripe';

const app = express();
const secretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = secretKey ? new Stripe(secretKey) : null;

app.post('/payments/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!stripe || !webhookSecret) return res.status(503).json({ error: 'payments_not_configured' });
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.header('stripe-signature'), webhookSecret);
  } catch {
    return res.status(400).json({ error: 'invalid_signature' });
  }
  console.log(JSON.stringify({ event_id: event.id, type: event.type, received_at: new Date().toISOString() }));
  res.json({ received: true });
});

app.get('/healthz', (_req, res) => res.json({ ok: true, service: 'payments', configured: Boolean(stripe && webhookSecret) }));
app.listen(Number(process.env.PORT || 8080), () => console.log('payments listening'));
