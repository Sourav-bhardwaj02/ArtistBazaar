import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProducts,
  getRecentSales,
  getTopProducts,
} from "../controllers/sellerController.js";

const router = express.Router();

// All routes under /api/seller
router.get("/products", protect, getProducts);
router.get("/recent-sales", protect, getRecentSales);
router.get("/top-products", protect, getTopProducts);

export default router;

