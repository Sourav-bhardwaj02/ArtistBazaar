import { Router } from "express";
import { requireAuth } from "../utils/auth.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const r = Router();

r.get("/overview", requireAuth(["Admin"]), async (_req, res) => {
  try {
    const totalSellers = await User.countDocuments({ role: "Seller" });
    const totalServices = await User.countDocuments({ role: "Services" });
    const totalCustomers = await User.countDocuments({ role: "Customer" });
    const totalProducts = await Product.countDocuments();
    return res.json({ 
      totalSellers, 
      totalServices, 
      totalCustomers,
      totalProducts, 
      anomaliesDetected: 0 
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    return res.status(500).json({ message: "Failed to fetch admin overview" });
  }
});

r.get("/sellers", requireAuth(["Admin"]), async (_req, res) => {
  const sellers = await User.find({ role: "Seller" }).select("email createdAt").lean();
  return res.json({ sellers });
});

r.get("/customers", requireAuth(["Admin"]), async (_req, res) => {
  return res.json({ customers: [] });
});

export default r;


