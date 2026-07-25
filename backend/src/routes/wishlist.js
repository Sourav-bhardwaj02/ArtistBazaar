import { Router } from "express";
import { z } from "zod";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import { requireAuth } from "../utils/auth.js";

const r = Router();

// Get user's wishlist
r.get("/wishlist", requireAuth(), async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id })
      .populate('product')
      .sort({ createdAt: -1 });
    
    return res.json({ items: wishlist });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching wishlist", error: error.message });
  }
});

// Add to wishlist
r.post("/wishlist/add", requireAuth(), async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({ user: req.user.id, product: productId });
    if (existingItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    const wishlistItem = await Wishlist.create({
      user: req.user.id,
      product: productId,
    });

    await wishlistItem.populate('product');
    return res.json({ message: "Added to wishlist", item: wishlistItem });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    return res.status(500).json({ message: "Error adding to wishlist", error: error.message });
  }
});

// Remove from wishlist
r.delete("/wishlist/:productId", requireAuth(), async (req, res) => {
  try {
    const { productId } = req.params;
    
    const wishlistItem = await Wishlist.findOneAndDelete({
      user: req.user.id,
      product: productId,
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    return res.json({ message: "Removed from wishlist" });
  } catch (error) {
    return res.status(500).json({ message: "Error removing from wishlist", error: error.message });
  }
});

// Check if product is in wishlist
r.get("/wishlist/check/:productId", requireAuth(), async (req, res) => {
  try {
    const { productId } = req.params;
    
    const wishlistItem = await Wishlist.findOne({
      user: req.user.id,
      product: productId,
    });

    return res.json({ inWishlist: !!wishlistItem });
  } catch (error) {
    return res.status(500).json({ message: "Error checking wishlist", error: error.message });
  }
});

export default r;
