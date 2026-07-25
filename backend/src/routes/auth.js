import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import User from "../models/User.js";
import { signToken, signRefreshToken, verifyRefreshToken } from "../utils/auth.js";

const r = Router();

// ==========================
// SCHEMAS
// ==========================
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["Customer", "Seller", "Services", "Admin"]).optional(),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["Customer", "Seller", "Services"]),
});

// ==========================
// SIGNUP
// ==========================
r.post("/signup", async (req, res) => {
  try {
    const { email, name, password, role } = signupSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Account already exists. Please log in." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let uniqueName = name;
    let counter = 1;
    while (await User.findOne({ name: uniqueName })) {
      uniqueName = `${name}${counter}`;
      counter++;
    }

    const user = await User.create({
      email,
      name: uniqueName,
      passwordHash,
      role,
      lastLogin: new Date(),
      isActive: true,
    });

    return res.status(201).json({
      message: "Account created successfully! Please log in.",
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error("Signup error:", e);
    if (e instanceof z.ZodError) {
      return res.status(400).json({ message: e.errors[0].message });
    }
    return res.status(500).json({ message: e.message || "Signup failed" });
  }
});

// ==========================
// LOGIN
// ==========================
r.post("/login", async (req, res) => {
  try {
    const { email, password, role } = loginSchema.parse(req.body);

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        message: "Account is temporarily locked due to too many failed login attempts. Please try again later." 
      });
    }

    if (role && role !== user.role) {
      return res.status(400).json({
        message: `Selected role (${role}) does not match account role (${user.role})`,
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated. Please contact support." });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment failed login attempts
      await user.incLoginAttempts();
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Reset failed login attempts on successful login
    await user.resetLoginAttempts();
    user.lastLogin = new Date();
    await user.save();

    const token = signToken({ id: String(user._id), role: user.role, email: user.email });
    const refreshToken = signRefreshToken({ id: String(user._id), role: user.role, email: user.email });

    return res.json({
      authToken: token,
      refreshToken,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      message: "Login successful",
    });
  } catch (e) {
    console.error("Login error:", e);
    if (e instanceof z.ZodError) {
      return res.status(400).json({ message: e.errors[0].message });
    }
    return res.status(500).json({ message: e.message || "Login failed" });
  }
});


// ==========================
// REFRESH TOKEN
// ==========================
r.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new tokens
    const newToken = signToken({ id: String(user._id), role: user.role, email: user.email });
    const newRefreshToken = signRefreshToken({ id: String(user._id), role: user.role, email: user.email });

    return res.json({
      authToken: newToken,
      refreshToken: newRefreshToken,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      message: "Token refreshed successfully",
    });
  } catch (e) {
    console.error("Refresh token error:", e);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

// ==========================
// LOGOUT
// ==========================
r.post("/logout", (req, res) => {
  return res.json({ message: "Logged out successfully" });
});

export default r;