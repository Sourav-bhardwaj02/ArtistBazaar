import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, maxlength: 120 },
    comment: { type: String, maxlength: 1000 },
    orderId: { type: String },
    verifiedPurchase: { type: Boolean, default: false },
    status: { type: String, enum: ["published", "pending", "rejected"], default: "published" },
  },
  { timestamps: true }
);

reviewSchema.index({ seller: 1, createdAt: -1 });
reviewSchema.index({ seller: 1, rating: -1 });

export default mongoose.model("Review", reviewSchema);
