import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import cartRoutes from "./routes/cart.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import wishlistRoutes from "./routes/wishlist.js";
import artisanRoutes from "./routes/artisans.js";
import uploadRoutes from "./routes/upload.js";
import profileRoutes from "./routes/profile.js";
import chatsRoutes from "./routes/chats.js";
import { cacheGet } from "./utils/cache.js";
import paymentsRouter, { razorpayWebhookHandler } from "./utils/razorpay.js";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  },
});
app.set("io", io);

io.on("connection", (socket) => {
  socket.on("conversation:join", (conversationId) => {
    if (conversationId) socket.join(`conversation:${conversationId}`);
  });
  socket.on("conversation:leave", (conversationId) => {
    if (conversationId) socket.leave(`conversation:${conversationId}`);
  });
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"] ,
      // Allow Razorpay SDK across subdomains
      scriptSrc: [
        "'self'",
        "https://checkout.razorpay.com",
        "https://*.razorpay.com"
      ],
      // Some browsers use script-src-elem for external scripts
      scriptSrcElem: [
        "'self'",
        "https://checkout.razorpay.com",
        "https://*.razorpay.com"
      ],
      connectSrc: [
        "'self'",
        "https://checkout.razorpay.com",
        "https://api.razorpay.com",
        "https://*.razorpay.com"
      ],
      frameSrc: [
        "'self'",
        "https://api.razorpay.com",
        "https://checkout.razorpay.com",
        "https://*.razorpay.com"
      ],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));


// Auth rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Note: Do not apply a global limiter to avoid 429s on normal browsing.

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "auth-token"],
  })
);

// Razorpay webhook must use raw body for signature verification. Mount BEFORE json/urlencoded parsers.
app.post(
  "/api/razorpay/webhook",
  express.raw({ type: "*/*", limit: "2mb" }),
  razorpayWebhookHandler
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Mount routes with distinct prefixes
app.use("/api/auth", authLimiter, authRoutes);
// Apply lightweight cache to common list endpoints
app.use("/api/products", cacheGet(30), productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", cacheGet(30), artisanRoutes);
app.use("/api/chats", chatsRoutes);
// Payments (Razorpay)
app.use("/api", paymentsRouter);

// Error handling for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const mongo = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/artist_bazaar";
mongoose
  .connect(mongo)
  .then(() => {
    const port = Number(process.env.PORT) || 4000;
    server.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });