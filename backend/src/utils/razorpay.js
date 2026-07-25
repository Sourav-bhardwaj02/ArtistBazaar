// import 'dotenv/config';
// // import dotenv from 'dotenv';
// import { Router } from 'express';
// import fs from 'fs';
// import path from 'path';
// import crypto from 'crypto';
// import Razorpay from 'razorpay';

// const router = Router();

// // Storage helpers (store under backend/data by default)
// const DATA_DIR = path.resolve(process.cwd(), 'backend', 'data');
// const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
// if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
// if (!fs.existsSync(PAYMENTS_FILE)) fs.writeFileSync(PAYMENTS_FILE, JSON.stringify([]));
// // dotenv.config();
// function readPayments() {
//   try {
//     const raw = fs.readFileSync(PAYMENTS_FILE, 'utf8');
//     return JSON.parse(raw);
//   } catch {
//     return [];
//   }
// }

// function writePayments(list) {
//   fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(list, null, 2));
// }

// // Razorpay client
// function getRazorpay() {
//   const key_id = process.env.RAZORPAY_KEY_ID;
//   const key_secret = process.env.RAZORPAY_KEY_SECRET;
//   if (!key_id || !key_secret) {
//     throw new Error('Missing RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET env');
//   }
//   return new Razorpay({ key_id, key_secret });
// }

// // Create order
// router.post('/payments/create-order', async (req, res) => {
//   try {
//     const { amount, currency = 'INR' } = req.body || {};
//     if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
//     const razorpay = getRazorpay();
//     // const order = await razorpay.orders.create({ amount, currency });
//     const order = await razorpay.orders.create({
//       amount: Math.round(amount * 100), // rupees → paise
//       currency,
//     });

//     // Return public key so frontend doesn't need to hardcode it
//     res.json({ order, key: process.env.RAZORPAY_KEY_ID });
//   } catch (e) {
//     res.status(500).json({ message: e.message || 'Failed to create order' });
//   }
// });

// // Verify payment & save record
// router.post('/payments/verify', (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartSnapshot, total } = req.body || {};
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ message: 'Missing payment parameters' });
//     }
//     const secret = process.env.RAZORPAY_KEY_SECRET;
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
//     const verified = expectedSignature === razorpay_signature;
//     const payments = readPayments();
//     const record = {
//       id: razorpay_payment_id,
//       orderId: razorpay_order_id,
//       signature: razorpay_signature,
//       verified,
//       total,
//       cartSnapshot: cartSnapshot || [],
//       createdAt: new Date().toISOString(),
//     };
//     payments.unshift(record);
//     writePayments(payments);
//     res.json({ ok: true, payment: record });
//   } catch (e) {
//     res.status(500).json({ message: e.message || 'Verification failed' });
//   }
// });

// // List payments
// router.get('/payments', (req, res) => {
//   try {
//     const payments = readPayments();
//     res.json({ payments });
//   } catch (e) {
//     res.status(500).json({ message: e.message || 'Failed to fetch payments' });
//   }
// });

// export default router;
import 'dotenv/config';
import express, { Router } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Payment from '../models/Payment.js';

const router = Router();

// Legacy JSON helpers kept for fallback (not used after DB migration)
const DATA_DIR = path.resolve(process.cwd(), 'backend', 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(PAYMENTS_FILE)) fs.writeFileSync(PAYMENTS_FILE, JSON.stringify([]));
function readPayments() {
  try { return JSON.parse(fs.readFileSync(PAYMENTS_FILE, 'utf8')); } catch { return []; }
}
function writePayments(list) { fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(list, null, 2)); }

// Razorpay client
function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET');
  }

  return new Razorpay({ key_id, key_secret });
}

// Create order
// router.post('/payments/create-order', async (req, res) => {
//   try {
//     const { amount, currency = 'INR' } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ message: 'Invalid amount' });
//     }

//     const razorpay = getRazorpay();

//     const order = await razorpay.orders.create({
//       amount: Math.round(amount * 100), // rupees → paise
//       currency,
//       receipt: `rcpt_${Date.now()}`,
//     });

//     res.json({
//       order,
//       key: process.env.RAZORPAY_KEY_ID,
//     });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// });
// Create order
router.post('/payments/create-order', async (req, res) => {
  try {
    // ⬇️ STEP 1: Read from body
    let { amount, currency = 'INR' } = req.body;

    // ⬇️ STEP 2: INSERT SAFETY GUARD HERE (THIS LINE)
    amount = Number(amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a number > 0' });
    }

    // ⬇️ STEP 3: Then continue as usual
    const razorpay = getRazorpay();

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // rupees → paise
      currency,
      receipt: `rcpt_${Date.now()}`,
    });

    res.json({
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


// Verify payment
router.post('/payments/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartSnapshot, total } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment parameters' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    const verified = expectedSignature === razorpay_signature;

    // Upsert payment record
    await Payment.findOneAndUpdate(
      { paymentId: razorpay_payment_id },
      {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        verified,
        status: verified ? 'captured' : 'failed',
        total,
        cartSnapshot: cartSnapshot || [],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ ok: true, verified });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// List payments
router.get('/payments', async (req, res) => {
  const items = await Payment.find({}).sort({ createdAt: -1 }).limit(100);
  res.json({ payments: items });
});

// Webhook handler (exported for server-level raw body usage)
export const razorpayWebhookHandler = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) return res.status(500).json({ message: 'Missing RAZORPAY_WEBHOOK_SECRET' });

    const digest = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body) // req.body must be raw buffer
      .digest('hex');
    if (digest !== signature) return res.status(400).json({ message: 'Invalid webhook signature' });

    const event = JSON.parse(req.body.toString());
    const type = event?.event;
    const payload = event?.payload || {};

    if (type === 'payment.captured' || type === 'payment.authorized' || type === 'payment.failed') {
      const p = payload?.payment?.entity || {};
      await Payment.findOneAndUpdate(
        { paymentId: p.id },
        {
          paymentId: p.id,
          orderId: p.order_id,
          amount: p.amount,
          currency: p.currency,
          status: p.status,
          method: p.method,
          email: p.email,
          contact: p.contact,
          raw: p,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else if (type === 'order.paid') {
      const o = payload?.order?.entity || {};
      await Payment.updateMany({ orderId: o.id }, { status: 'captured' });
    }

    res.json({ received: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default router;
