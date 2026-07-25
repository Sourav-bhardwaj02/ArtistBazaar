import { Router } from "express";
import { z } from "zod";
import User from "../models/User.js";
import { requireAuth } from "../utils/auth.js";
import { upload } from "../utils/cloudinary.js";

const r = Router();

// Helpers to accept empty or add protocol for URLs
const urlOptional = z.preprocess((val) => {
  if (typeof val !== 'string') return val;
  const s = val.trim();
  if (s === '') return undefined; // treat empty string as undefined
  const withProto = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  return withProto;
}, z.string().url().max(200)).optional();

// Profile update schema
const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  website: urlOptional,
  socialMedia: z.object({
    instagram: z.string().max(100).optional(),
    facebook: z.string().max(100).optional(),
    twitter: z.string().max(100).optional()
  }).optional(),
  specialties: z.array(z.string().max(50)).optional(),
  experience: z.string().max(100).optional(),
  education: z.string().max(200).optional(),
  achievements: z.array(z.string().max(200)).optional(),
  awards: z.array(z.string().max(200)).optional()
});

// Upload shop banner/cover image
r.post("/banner", requireAuth(), upload.single('banner'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old banner if exists
    if (user.shopBannerData && user.shopBannerData.publicId) {
      try {
        const { deleteImage } = await import("../utils/cloudinary.js");
        await deleteImage(user.shopBannerData.publicId);
      } catch (deleteError) {
        console.error("Error deleting old banner:", deleteError);
      }
    }

    user.shopBanner = req.file.secure_url;
    user.shopBannerData = {
      publicId: req.file.public_id,
      url: req.file.secure_url,
      width: req.file.width,
      height: req.file.height,
      format: req.file.format
    };

    await user.save();

    res.json({
      success: true,
      message: "Banner updated successfully",
      shopBanner: user.shopBanner,
      shopBannerData: user.shopBannerData
    });
  } catch (error) {
    console.error("Banner upload error:", error);
    res.status(500).json({ message: "Failed to upload banner" });
  }
});

// Get user profile
r.get("/", requireAuth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -failedLoginAttempts -lockUntil');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        bio: user.bio,
        location: user.location,
        phone: user.phone,
        website: user.website,
        socialMedia: user.socialMedia,
        specialties: user.specialties,
        experience: user.experience,
        education: user.education,
        achievements: user.achievements,
        awards: user.awards,
        isVerifiedSeller: user.isVerifiedSeller,
        responseRate: user.responseRate,
        responseTimeMinutesAvg: user.responseTimeMinutesAvg,
        shopBanner: user.shopBanner,
        shopBannerData: user.shopBannerData,
        avatarData: user.avatarData,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Update user profile
r.put("/", requireAuth(), async (req, res) => {
  try {
    const updateData = profileUpdateSchema.parse(req.body);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        bio: user.bio,
        location: user.location,
        phone: user.phone,
        website: user.website,
        socialMedia: user.socialMedia,
        specialties: user.specialties,
        experience: user.experience,
        education: user.education,
        achievements: user.achievements,
        awards: user.awards,
        isVerifiedSeller: user.isVerifiedSeller,
        responseRate: user.responseRate,
        responseTimeMinutesAvg: user.responseTimeMinutesAvg,
        shopBanner: user.shopBanner,
        shopBannerData: user.shopBannerData,
        avatarData: user.avatarData
      }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// Upload profile avatar
r.post("/avatar", requireAuth(), upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old avatar if exists
    if (user.avatarData && user.avatarData.publicId) {
      try {
        const { deleteImage } = await import("../utils/cloudinary.js");
        await deleteImage(user.avatarData.publicId);
      } catch (deleteError) {
        console.error("Error deleting old avatar:", deleteError);
        // Continue with upload even if deletion fails
      }
    }

    // Update user with new avatar data
    user.avatar = req.file.secure_url;
    user.avatarData = {
      publicId: req.file.public_id,
      url: req.file.secure_url,
      width: req.file.width,
      height: req.file.height,
      format: req.file.format
    };

    await user.save();

    res.json({
      success: true,
      message: "Avatar updated successfully",
      avatar: user.avatar,
      avatarData: user.avatarData
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ message: "Failed to upload avatar" });
  }
});

// Get all sellers for artisans page
r.get("/sellers", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", location = "" } = req.query;
    
    const query = { 
      role: "Seller",
      isActive: true 
    };

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { specialties: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Add location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const sellers = await User.find(query)
      .select('name email avatar bio location specialties experience achievements awards socialMedia avatarData createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      sellers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error("Get sellers error:", error);
    res.status(500).json({ message: "Failed to fetch sellers" });
  }
});

// Get seller by ID
r.get("/seller/:id", async (req, res) => {
  try {
    const seller = await User.findOne({ 
      _id: req.params.id, 
      role: "Seller",
      isActive: true 
    }).select('name email avatar bio location specialties experience education achievements awards socialMedia avatarData createdAt');

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json({
      success: true,
      seller
    });
  } catch (error) {
    console.error("Get seller error:", error);
    res.status(500).json({ message: "Failed to fetch seller" });
  }
});

export default r;
