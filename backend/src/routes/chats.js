import { Router } from "express";
import { requireAuth } from "../utils/auth.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

const r = Router();

// Ensure conversation exists between two users (seller-customer)
async function ensureConversation(userIdA, userIdB) {
  const a = new mongoose.Types.ObjectId(userIdA);
  const b = new mongoose.Types.ObjectId(userIdB);
  const participants = [a, b];
  let conv = await Conversation.findOne({ participants: { $all: participants, $size: 2 } });
  if (!conv) {
    conv = await Conversation.create({ participants, lastMessageAt: new Date(), unreadCount: {} });
  }
  return conv;
}

// Get current user's conversations
r.get("/conversations", requireAuth(), async (req, res) => {
  try {
    const items = await Conversation.find({ participants: req.user.id })
      .sort({ lastMessageAt: -1 })
      .populate({ path: "participants", select: "name email avatar role" });

    const mapped = items.map((c) => ({
      id: c._id,
      participants: c.participants,
      lastMessage: c.lastMessage || "",
      lastMessageAt: c.lastMessageAt,
      unread: Number(c.unreadCount?.get?.(String(req.user.id)) || 0),
    }));

    res.json({ conversations: mapped });
  } catch (e) {
    res.status(500).json({ message: e.message || "Failed to fetch conversations" });
  }
});

// Start or get conversation with a specific user
r.post("/conversations/start", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });
    const conv = await ensureConversation(req.user.id, userId);
    res.json({ id: conv._id });
  } catch (e) {
    res.status(500).json({ message: e.message || "Failed to start conversation" });
  }
});

// Get messages for a conversation
r.get("/conversations/:id/messages", requireAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50, before } = req.query;

    const conv = await Conversation.findById(id);
    if (!conv || !conv.participants.map(String).includes(String(req.user.id))) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const filter = { conversation: id };
    if (before) filter.createdAt = { $lt: new Date(before) };

    const items = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(200, Number(limit) || 50))
      .populate({ path: "sender", select: "name avatar role" })
      .populate({ path: "recipient", select: "name avatar role" });

    res.json({ items: items.reverse() });
  } catch (e) {
    res.status(500).json({ message: e.message || "Failed to fetch messages" });
  }
});

// Send message
r.post("/conversations/:id/messages", requireAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: "text is required" });

    const conv = await Conversation.findById(id);
    if (!conv || !conv.participants.map(String).includes(String(req.user.id))) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Determine recipient as the other participant
    const recipient = conv.participants.map(String).find((p) => p !== String(req.user.id));

    const msg = await Message.create({
      conversation: id,
      sender: req.user.id,
      recipient,
      text: text.trim(),
    });

    conv.lastMessage = msg.text;
    conv.lastMessageAt = msg.createdAt;
    // increment unread for recipient
    const current = Number(conv.unreadCount?.get?.(recipient) || 0) + 1;
    conv.unreadCount.set(recipient, current);
    await conv.save();

    // Emit socket event to conversation room
    try {
      const io = req.app.get('io');
      if (io) {
        const populated = await Message.findById(msg._id)
          .populate({ path: 'sender', select: 'name avatar role' })
          .populate({ path: 'recipient', select: 'name avatar role' });
        io.to(`conversation:${id}`).emit('message:new', { conversationId: id, message: populated });
      }
    } catch (e) {
      // non-fatal
    }

    res.status(201).json({ message: msg });
  } catch (e) {
    res.status(500).json({ message: e.message || "Failed to send message" });
  }
});

// Mark as read
r.post("/conversations/:id/read", requireAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    const conv = await Conversation.findById(id);
    if (!conv || !conv.participants.map(String).includes(String(req.user.id))) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    conv.unreadCount.set(String(req.user.id), 0);
    await conv.save();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message || "Failed to mark read" });
  }
});

export default r;
