import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    // Optional: link to seller explicitly for quick queries
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessage: { type: String },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ seller: 1, customer: 1 }, { unique: true, partialFilterExpression: { seller: { $type: "objectId" }, customer: { $type: "objectId" } } });

export default mongoose.model("Conversation", conversationSchema);
