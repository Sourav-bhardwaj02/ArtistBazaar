// backend/src/controllers/sellerController.js
import Product from "../models/Product.js";

// @desc Get all seller products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json({ items: products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get recent sales (dummy for now)
export const getRecentSales = async (req, res) => {
  try {
    // TODO: Replace with actual orders model
    const dummySales = [
      {
        id: "ORD123",
        product: "Oil Painting",
        customer: "John Doe",
        status: "paid",
        amount: "₹2000",
      },
      {
        id: "ORD124",
        product: "Sketch",
        customer: "Jane Smith",
        status: "shipped",
        amount: "₹1500",
      },
    ];
    res.json({ items: dummySales });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get top products
export const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ sales: -1 })
      .limit(5);

    const formatted = products.map((p) => ({
      name: p.name,
      sales: p.sales,
      revenue: `₹${p.revenue}`,
      growth: Math.floor(Math.random() * 30) + 5, // fake growth %
    }));

    res.json({ items: formatted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// @desc Create new product
export const createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      seller: req.user._id, // always attach seller from auth
    });
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
