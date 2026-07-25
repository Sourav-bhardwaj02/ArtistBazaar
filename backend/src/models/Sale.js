import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    product: { type: String, required: true },
    customer: { type: String, required: true },
    status: { type: String, enum: ["paid", "pending", "shipped"], default: "pending" },
    amount: { type: Number, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // so each seller sees their own sales
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
