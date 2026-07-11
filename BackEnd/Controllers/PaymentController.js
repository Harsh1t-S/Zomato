const Razorpay = require('razorpay');
const crypto = require('crypto');

const paymentsEnabled = () =>
    process.env.RAZORPAY_ENABLED === 'true' &&
    !!process.env.RAZORPAY_KEY_ID &&
    !!process.env.RAZORPAY_KEY_SECRET;

const getClient = () =>
    new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

// Verifies the HMAC-SHA256 signature Razorpay returns after a successful
// checkout, using our key secret. This is the only trustworthy way to know
// a payment actually went through — never trust a client-supplied "paid"
// status on its own. Exported so OrderController can re-run the same check
// before persisting an order (defense in depth: a client could otherwise
// call /api/orders directly with a made-up paymentId).
const verifyRazorpaySignature = (orderId, paymentId, signature) => {
    if (!orderId || !paymentId || !signature) return false;
    const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
    // Constant-time comparison to avoid leaking signature bytes via timing.
    const expectedBuf = Buffer.from(expected, 'hex');
    const givenBuf = Buffer.from(String(signature), 'hex');
    if (expectedBuf.length !== givenBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, givenBuf);
};

// Creates a Razorpay order for the given rupee amount so the frontend can
// open Razorpay Checkout against it. Amount is taken from the server side
// of the cart total that's passed in, converted to paise (Razorpay's unit).
const createRazorpayOrder = async (req, res) => {
    try {
        if (!paymentsEnabled()) {
            return res.status(503).json({ error: 'Payments are not enabled on this server.' });
        }

        const amountRupees = Number(req.body?.amount);
        if (!amountRupees || amountRupees <= 0) {
            return res.status(400).json({ error: 'A valid amount is required.' });
        }

        const razorpay = getClient();
        const order = await razorpay.orders.create({
            amount: Math.round(amountRupees * 100), // paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            notes: { userId: String(req.auth.id) },
        });

        res.status(201).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Razorpay order creation failed:', error);
        res.status(500).json({ error: 'Failed to create payment order.' });
    }
};

// Optional pre-check the frontend can call right after Razorpay Checkout
// succeeds, purely for UI feedback ("Verifying payment...") before it goes
// on to actually place the order. OrderController.createOrder re-verifies
// independently, so this endpoint isn't a security boundary by itself.
const verifyPayment = async (req, res) => {
    try {
        if (!paymentsEnabled()) {
            return res.status(503).json({ error: 'Payments are not enabled on this server.' });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
        const valid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!valid) {
            return res.status(400).json({ verified: false, error: 'Payment signature verification failed.' });
        }

        res.json({ verified: true, paymentId: razorpay_payment_id, orderId: razorpay_order_id });
    } catch (error) {
        console.error('Payment verification failed:', error);
        res.status(500).json({ error: 'Payment verification failed.' });
    }
};

module.exports = { createRazorpayOrder, verifyPayment, verifyRazorpaySignature, paymentsEnabled };
