import express from 'express';
import Stripe from 'stripe';

const app = express();
const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = secretKey ? new Stripe(secretKey) : null;
app.use(express.json({ limit: '32kb' }));
app.post('/payments/checkout-session', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'payments_not_configured' });
  const { price_id: priceId, customer_email: customerEmail } = req.body ?? {};
  if (!priceId || typeof priceId !== 'string') return res.status(400).json({ error: 'price_id_required' });
  const successUrl = process.env.STRIPE_SUCCESS_URL;
  const cancelUrl = process.env.STRIPE_CANCEL_URL;
  if (!successUrl || !cancelUrl) return res.status(503).json({ error: 'checkout_urls_not_configured' });
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail || undefined, success_url: successUrl, cancel_url: cancelUrl,
      billing_address_collection: 'auto',
    }, { idempotencyKey: req.header('Idempotency-Key') || undefined });
    return res.status(201).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error(JSON.stringify({ event:'stripe.checkout.error', type:error?.type||'unknown', code:error?.code||null, message:error?.message||'checkout_failed' }));
    return res.status(502).json({ error: 'checkout_failed' });
  }
});
app.get('/healthz', (_req, res) => res.json({ ok:true, service:'payments-checkout', configured:Boolean(stripe) }));
app.listen(Number(process.env.PORT||8080),()=>console.log('payments checkout listening'));