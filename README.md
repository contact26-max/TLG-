# TLG AI Receptionist - Stripe Payment Integration

A minimal Express.js server with Stripe Checkout integration for the TLG AI receptionist system.

## Features

- 🎯 **Stripe Checkout Sessions** – Secure payment processing
- 🎨 **Modern UI** – Responsive pricing page with multiple tiers
- 📱 **Mobile Ready** – Works on all devices
- 🔒 **Environment Variables** – Secure credential management
- ✅ **Success/Cancel Pages** – Post-payment feedback

## Prerequisites

- Node.js 16+ installed
- Stripe account (free at [stripe.com](https://stripe.com))
- Stripe API keys (Secret and Publishable)
- Price IDs created in Stripe Dashboard

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Stripe Keys

1. Sign up at [stripe.com](https://stripe.com)
2. Go to **Dashboard** → **Developers** → **API keys**
3. Copy your **Secret Key** (starts with `sk_test_`)
4. Copy your **Publishable Key** (starts with `pk_test_`)

### 3. Create Price IDs

1. In Stripe Dashboard, go to **Products**
2. Create products for each plan (Starter, Pro, Enterprise)
3. For each product, create a price and copy the price ID (starts with `price_`)

### 4. Configure Environment

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

```bash
# .env
STRIPE_SECRET_KEY=sk_test_your_actual_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key
STRIPE_STARTER_PRICE_ID=price_1234567890
STRIPE_PRO_PRICE_ID=price_0987654321
PORT=3000
```

### 5. Update Pricing Page

Edit `public/index.html` and replace the price IDs in the buttons:

```html
<button class="cta-button" data-price-id="price_1234567890">
  Start Free Trial
</button>
```

## Running the Server

### Development

```bash
npm run dev
```

Server will run with auto-reload on file changes.

### Production

```bash
npm start
```

Server runs on `http://localhost:3000` by default.

## API Endpoints

### `GET /health`

Check server and Stripe configuration status.

```bash
curl http://localhost:3000/health
```

### `POST /create-checkout-session`

Create a Stripe Checkout session.

**Request:**

```json
{
  "priceId": "price_1234567890",
  "customerType": "pro"
}
```

**Response:**

```json
{
  "url": "https://checkout.stripe.com/...",
  "sessionId": "cs_..."
}
```

### `GET /session/:sessionId`

Retrieve checkout session details.

```bash
curl http://localhost:3000/session/cs_...
```

## Project Structure

```
.
├── server.js                # Express server & API routes
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── public/
    ├── index.html           # Pricing page
    ├── success.html         # Payment success page
    └── cancel.html          # Payment cancelled page
```

## Development Notes

- Use Stripe's test keys (start with `sk_test_` and `pk_test_`) for development
- Test card: `4242 4242 4242 4242` with any future date and CVC
- For production, switch to live keys after enabling Stripe on your account
- All environment variables are required for the server to function

## Testing

1. Start the server: `npm run dev`
2. Open `http://localhost:3000`
3. Click a plan button
4. Use Stripe test card `4242 4242 4242 4242`
5. Fill in any future date and 3-digit CVC
6. You'll be redirected to success or cancel page

## Troubleshooting

**"Stripe is not configured" error**

- Check `.env` file exists and has `STRIPE_SECRET_KEY`
- Restart the server after updating `.env`

**"Missing priceId" error**

- Update the `data-price-id` attributes in `public/index.html`
- Use actual price IDs from your Stripe Dashboard

**Checkout page won't load**

- Verify Stripe API keys are correct
- Check browser console for errors
- Ensure server is running and accessible

## Next Steps

- Add webhook handling for payment confirmations
- Implement customer database integration
- Add subscription management
- Set up email notifications
- Deploy to production (Heroku, AWS, etc.)

## License

MIT
