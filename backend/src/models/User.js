import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, // Normalize emails
    trim: true, // Remove whitespace
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"] // Email validation
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100 // Prevent overly long names
  },
  avatar: { 
    type: String,
    default: "https://via.placeholder.com/150" // Default avatar
  },
  role: { 
    type: String, 
    enum: ["Customer", "Seller", "Services", "Admin"], 
    default: "Customer",
    required: true
  },
  passwordHash: { 
    type: String,
    required: true,
    select: false // Exclude from queries by default for security
  },
  lastLogin: { 
    type: Date,
    default: Date.now // Default to creation time
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  // Profile information
  bio: {
    type: String,
    maxlength: 500
  },
  location: {
    type: String,
    maxlength: 100
  },
  phone: {
    type: String,
    maxlength: 20
  },
  website: {
    type: String,
    maxlength: 200
  },
  // Social media links
  socialMedia: {
    instagram: { type: String, maxlength: 100 },
    facebook: { type: String, maxlength: 100 },
    twitter: { type: String, maxlength: 100 }
  },
  // Professional information (for sellers)
  specialties: [{
    type: String,
    maxlength: 50
  }],
  experience: {
    type: String,
    maxlength: 100
  },
  education: {
    type: String,
    maxlength: 200
  },
  achievements: [{
    type: String,
    maxlength: 200
  }],
  awards: [{
    type: String,
    maxlength: 200
  }],
  // Seller trust & performance
  isVerifiedSeller: {
    type: Boolean,
    default: false
  },
  responseRate: {
    // percentage 0-100
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  responseTimeMinutesAvg: {
    type: Number,
    min: 0,
    default: 60
  },
  // Shop banner/cover
  shopBanner: {
    type: String,
    maxlength: 500
  },
  shopBannerData: {
    publicId: String,
    url: String,
    width: Number,
    height: Number,
    format: String
  },
  // Cloudinary image data
  avatarData: {
    publicId: String,
    url: String,
    width: Number,
    height: Number,
    format: String
  }
}, {
  timestamps: true // Auto-add createdAt and updatedAt
});

// Index for efficient queries
userSchema.index({ name: 1 });

// Pre-save hook for password hashing (if modified)
userSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash") && this.passwordHash) {
    const bcrypt = await import("bcryptjs");
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

// Virtual for account lockout
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) return false;
  const bcrypt = await import("bcryptjs");
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Method to handle failed login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { failedLoginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { failedLoginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.failedLoginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset failed login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { failedLoginAttempts: 1, lockUntil: 1 }
  });
};


const User = mongoose.model("User", userSchema);
export default User;
