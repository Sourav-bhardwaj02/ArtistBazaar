import { Router } from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import { requireAuth } from "../utils/auth.js";

const r = Router();

// Get all artisans (sellers and services)
r.get("/artisans", async (req, res) => {
  try {
    const { q, role, sort = "-createdAt", page = "1", limit = "20" } = req.query;
    
    const filter = {
      role: { $in: ["Seller", "Services"] }
    };
    
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ];
    }
    
    if (role) {
      filter.role = role;
    }

    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(String(limit)) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [artisans, total] = await Promise.all([
      User.find(filter)
        .select("-passwordHash")
        .sort(String(sort))
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    // Get product counts for each artisan
    const artisansWithStats = await Promise.all(
      artisans.map(async (artisan) => {
        const productCount = await Product.countDocuments({ seller: artisan._id });
        const totalSales = await Product.aggregate([
          { $match: { seller: artisan._id } },
          { $group: { _id: null, total: { $sum: "$sales" } } }
        ]);
        
        return {
          ...artisan.toObject(),
          productCount,
          totalSales: totalSales[0]?.total || 0
        };
      })
    );

    return res.json({ 
      items: artisansWithStats, 
      total, 
      page: pageNum, 
      pages: Math.ceil(total / limitNum) 
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching artisans", error: error.message });
  }
});

// Get single artisan with their products
r.get("/artisans/:id", async (req, res) => {
  try {
    const artisan = await User.findById(req.params.id)
      .select("-passwordHash");
    
    if (!artisan || !["Seller", "Services"].includes(artisan.role)) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    // Filters for product catalog (optional)
    const { q, category, minPrice, maxPrice, sort = "-createdAt", page = "1", limit = "10" } = req.query;
    const filter = { seller: artisan._id };
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } }
      ];
    }
    if (category) filter.category = String(category);
    if (minPrice || maxPrice) filter.price = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
    };

    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(String(limit)) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [productCount, categories, topSelling, recentProducts, catalogDocs, totalCatalog, ratingAgg] = await Promise.all([
      Product.countDocuments({ seller: artisan._id }),
      Product.distinct("category", { seller: artisan._id }),
      Product.find({ seller: artisan._id }).sort({ sales: -1 }).limit(5),
      Product.find({ seller: artisan._id }).sort({ createdAt: -1 }).limit(6),
      Product.find(filter).sort(String(sort)).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
      Review.aggregate([
        { $match: { seller: artisan._id, status: "published" } },
        { $group: { _id: "$seller", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
      ])
    ]);

    const avgRating = ratingAgg?.[0]?.avgRating || 0;
    const reviewCount = ratingAgg?.[0]?.count || 0;

    return res.json({
      artisan: {
        ...artisan.toObject(),
        overview: {
          productCount,
          categories,
          topSelling,
          recentProducts,
          catalog: {
            items: catalogDocs,
            total: totalCatalog,
            page: pageNum,
            pages: Math.ceil(totalCatalog / limitNum)
          }
        },
        trust: {
          avgRating,
          reviews: reviewCount,
          responseRate: artisan.responseRate ?? 100,
          responseTimeMinutesAvg: artisan.responseTimeMinutesAvg ?? 60,
          isVerifiedSeller: !!artisan.isVerifiedSeller,
          joinDate: artisan.createdAt
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching artisan", error: error.message });
  }
});

export default r;
