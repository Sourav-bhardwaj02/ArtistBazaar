import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import Product from "./src/models/Product.js";
import bcrypt from "bcryptjs";

dotenv.config();

const mongo = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/artist_bazaar";

const sampleUsers = [
  {
    email: "seller1@example.com",
    name: "Priya Sharma",
    passwordHash: await bcrypt.hash("password123", 10),
    role: "Seller",
    authType: "normal",
    avatar: "https://via.placeholder.com/150",
  },
  {
    email: "seller2@example.com", 
    name: "Anita Desai",
    passwordHash: await bcrypt.hash("password123", 10),
    role: "Seller",
    authType: "normal",
    avatar: "https://via.placeholder.com/150",
  },
  {
    email: "customer1@example.com",
    name: "Raj Kumar",
    passwordHash: await bcrypt.hash("password123", 10),
    role: "Customer",
    authType: "normal",
    avatar: "https://via.placeholder.com/150",
  },
  {
    email: "admin@example.com",
    name: "Admin User",
    passwordHash: await bcrypt.hash("admin123", 10),
    role: "Admin",
    authType: "normal",
    avatar: "https://via.placeholder.com/150",
  }
];

const sampleProducts = [
  {
    name: "Hand-Painted Terracotta Vase",
    description: "A beautifully hand-painted terracotta vase with traditional motifs, perfect for home decoration.",
    category: "Pottery",
    price: 1200,
    stock: 5,
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop"],
    tags: ["handmade", "traditional", "gift"],
    status: "active",
  },
  {
    name: "Silver Jhumka Earrings",
    description: "Elegant sterling silver jhumka earrings with detailed filigree work, ideal for festive occasions.",
    category: "Jewelry",
    price: 2500,
    stock: 8,
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop"],
    tags: ["handmade", "traditional", "premium"],
    status: "active",
  },
  {
    name: "Handwoven Cotton Saree",
    description: "A soft, handwoven cotton saree with vibrant block prints, showcasing traditional craftsmanship.",
    category: "Textiles",
    price: 3500,
    stock: 3,
    images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=500&h=500&fit=crop"],
    tags: ["handmade", "traditional", "eco"],
    status: "active",
  },
  {
    name: "Rosewood Carved Jewelry Box",
    description: "A finely carved rosewood jewelry box with brass inlay, perfect for gifting or personal use.",
    category: "Woodwork",
    price: 1800,
    stock: 6,
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop"],
    tags: ["handmade", "premium", "gift"],
    status: "active",
  },
  {
    name: "Bamboo Wall Hanging",
    description: "Eco-friendly bamboo wall hanging with intricate weaves, adding a rustic charm to any space.",
    category: "Craft",
    price: 900,
    stock: 10,
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop"],
    tags: ["handmade", "eco", "gift"],
    status: "active",
  },
  {
    name: "Clay Kulhad Set (6 Pieces)",
    description: "Set of six handcrafted clay kulhads, perfect for serving tea or coffee in traditional style.",
    category: "Pottery",
    price: 600,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop"],
    tags: ["handmade", "traditional", "eco"],
    status: "active",
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(mongo);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const users = await User.insertMany(sampleUsers);
    console.log(`Created ${users.length} users`);

    // Create products with seller references
    const seller1 = users.find(u => u.email === "seller1@example.com");
    const seller2 = users.find(u => u.email === "seller2@example.com");

    const products = await Product.insertMany([
      { ...sampleProducts[0], seller: seller1._id },
      { ...sampleProducts[1], seller: seller1._id },
      { ...sampleProducts[2], seller: seller2._id },
      { ...sampleProducts[3], seller: seller2._id },
      { ...sampleProducts[4], seller: seller1._id },
      { ...sampleProducts[5], seller: seller2._id },
    ]);
    console.log(`Created ${products.length} products`);

    console.log("Database seeded successfully!");
    console.log("\nTest accounts:");
    console.log("Seller 1: seller1@example.com / password123");
    console.log("Seller 2: seller2@example.com / password123");
    console.log("Customer: customer1@example.com / password123");
    console.log("Admin: admin@example.com / admin123");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedDatabase();
