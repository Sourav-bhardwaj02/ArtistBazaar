import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller is required"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    category: {
      type: String,
      trim: true,
      enum: {
        values: [
          "Pottery",
          "Jewelry",
          "Textiles",
          "Woodwork",
          "Bamboo",
          "Painting",
          "Sculpture",
          "Craft",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    image: {
      type: String,
      trim: true,
      match: [/^(http|https):\/\/[^\s/$.?#].[^\s]*$/, "Please provide a valid URL for the image"],
    },
    sales: {
      type: Number,
      default: 0,
      min: [0, "Sales cannot be negative"],
    },
    revenue: {
      type: Number,
      default: 0,
      min: [0, "Revenue cannot be negative"],
    },
    images: [{
      type: String,
      trim: true,
    }],
    // Cloudinary image data
    imagesData: [{
      publicId: String,
      url: String,
      width: Number,
      height: Number,
      format: String,
      size: Number
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Index for faster queries by seller and name
productSchema.index({ seller: 1, name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ price: 1 });

export default mongoose.model("Product", productSchema);

