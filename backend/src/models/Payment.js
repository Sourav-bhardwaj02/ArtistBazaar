import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, index: true },
    orderId: { type: String, index: true, required: true },
    amount: { type: Number }, // in paise
    currency: { type: String, default: "INR" },
    status: { type: String }, // created|authorized|captured|failed|refunded|canceled
    method: { type: String },
    email: { type: String },
    contact: { type: String },
    verified: { type: Boolean, default: false },
    total: { type: Number }, // rupees snapshot
    cartSnapshot: { type: Array, default: [] },
    raw: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);
