import { Router } from "express";
import { z } from "zod";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { requireAuth } from "../utils/auth.js";

const r = Router();

const addSchema = z.object({ productId: z.string(), quantity: z.coerce.number().int().positive() });

async function ensureCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

// Normalize product images into a string[] of URLs
function normalizeImages(product) {
  if (!product) return [];
  if (Array.isArray(product.images) && product.images.length) return product.images;
  if (Array.isArray(product.imagesData) && product.imagesData.length) {
    return product.imagesData.map((x) => x?.url).filter(Boolean);
  }
  if (product.image) return [product.image];
  return [];
}

// Populate cart items with product details needed by frontend
async function getPopulatedCartItems(userId) {
  const cart = await ensureCart(userId);
  // populate the product doc for each item
  await cart.populate({ path: "items.productId", model: "Product" });
  const items = cart.items.map((item) => {
    const p = item.productId;
    const product = p
      ? {
          _id: String(p._id),
          name: p.name,
          price: p.price,
          images: normalizeImages(p),
          category: p.category,
        }
      : undefined;
    return {
      productId: String(item.productId),
      quantity: item.quantity,
      priceSnapshot: item.priceSnapshot,
      ...(product ? { product } : {}),
    };
  });
  return items;
}

r.get("/", requireAuth(), async (req, res) => {
  const items = await getPopulatedCartItems(req.user.id);
  return res.json({ items });
});

r.post("/add", requireAuth(), async (req, res) => {
  try {
    const { productId, quantity } = addSchema.parse(req.body);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const cart = await ensureCart(req.user.id);
    const idx = cart.items.findIndex((i) => String(i.productId) === String(productId));
    if (idx >= 0) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, priceSnapshot: product.price });
    }
    await cart.save();
    const items = await getPopulatedCartItems(req.user.id);
    return res.json({ message: "Added to cart", cart: { items } });
  } catch (e) {
    return res.status(400).json({ message: e.message || "Invalid payload" });
  }
});

r.post("/update", requireAuth(), async (req, res) => {
  try {
    const { productId, quantity } = addSchema.parse(req.body);
    const cart = await ensureCart(req.user.id);
    const idx = cart.items.findIndex((i) => String(i.productId) === String(productId));
    if (idx < 0) return res.status(404).json({ message: "Item not in cart" });
    if (quantity <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = quantity;
    }
    await cart.save();
    const items = await getPopulatedCartItems(req.user.id);
    return res.json({ message: "Cart updated", cart: { items } });
  } catch (e) {
    return res.status(400).json({ message: e.message || "Invalid payload" });
  }
});

r.post("/clear", requireAuth(), async (req, res) => {
  const cart = await ensureCart(req.user.id);
  cart.items = [];
  await cart.save();
  return res.json({ message: "Cart cleared", cart: { items: [] } });
});

// Increment quantity by 1 (or add item if absent)
r.post("/increase", requireAuth(), async (req, res) => {
  try {
    const { productId } = z.object({ productId: z.string() }).parse(req.body);
    const cart = await ensureCart(req.user.id);
    const idx = cart.items.findIndex((i) => String(i.productId) === String(productId));
    if (idx >= 0) {
      cart.items[idx].quantity += 1;
    } else {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });
      cart.items.push({ productId, quantity: 1, priceSnapshot: product.price });
    }
    await cart.save();
    const items = await getPopulatedCartItems(req.user.id);
    return res.json({ message: "Cart updated", cart: { items } });
  } catch (e) {
    return res.status(400).json({ message: e.message || "Invalid payload" });
  }
});

// Decrement quantity by 1 (remove if reaches 0)
r.post("/decrease", requireAuth(), async (req, res) => {
  try {
    const { productId } = z.object({ productId: z.string() }).parse(req.body);
    const cart = await ensureCart(req.user.id);
    const idx = cart.items.findIndex((i) => String(i.productId) === String(productId));
    if (idx < 0) return res.status(404).json({ message: "Item not in cart" });
    const nextQty = cart.items[idx].quantity - 1;
    if (nextQty <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = nextQty;
    }
    await cart.save();
    const items = await getPopulatedCartItems(req.user.id);
    return res.json({ message: "Cart updated", cart: { items } });
  } catch (e) {
    return res.status(400).json({ message: e.message || "Invalid payload" });
  }
});

// Delete an item from cart
r.delete("/item/:productId", requireAuth(), async (req, res) => {
  const { productId } = req.params;
  const cart = await ensureCart(req.user.id);
  const before = cart.items.length;
  cart.items = cart.items.filter((i) => String(i.productId) !== String(productId));
  if (cart.items.length === before) {
    return res.status(404).json({ message: "Item not in cart" });
  }
  await cart.save();
  const items = await getPopulatedCartItems(req.user.id);
  return res.json({ message: "Item removed", cart: { items } });
});

export default r;


