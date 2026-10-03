require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_key')) {
  console.warn('⚠️  Warning: Stripe secret key not configured. Add it to .env');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'TLG Stripe Payment API',
    stripeConfigured: Boolean(
      process.env.STRIPE_SECRET_KEY &&
      !process.env.STRIPE_SECRET_KEY.includes('your_key')
    )
  });
});

// Create Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { priceId, customerType } = req.body;

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_key')) {
    return res.status(500).json({
      error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to .env file.'
    });
  }

  if (!priceId) {
    return res.status(400).json({
      error: 'Missing priceId. Include priceId in request body.'
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${req.protocol}://${req.get('host')}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel.html`,
      metadata: {
        source: 'tlg-ai-receptionist',
        customerType: customerType || 'unknown'
      }
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe session creation failed:', error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

// Retrieve session for confirmation
app.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json({
      status: session.payment_status,
      email: session.customer_email,
      amount: session.amount_total,
      currency: session.currency
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Serve index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`\n🚀 TLG Stripe Payment Server`);
  console.log(`📍 Running on http://localhost:${port}`);
  console.log(`\n📖 API Endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   POST /create-checkout-session`);
  console.log(`   GET  /session/:sessionId\n`);
});
