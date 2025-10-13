// src/context/ProductContext.tsx
import { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  images?: string[];
  tags?: string[];
  artisan?: string;
  location?: string;
}

interface ProductContextType {
  products: ApiProduct[];
  setProducts: (products: ApiProduct[]) => void;
  q: string;
  setQ: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  page: number;
  setPage: (page: number) => void;
  pages: number;
  setPages: (pages: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchProducts: (p?: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: ApiProduct[] = [
  {
    "_id": "1",
    "name": "Hand-Painted Terracotta Vase",
    "description": "A beautifully hand-painted terracotta vase...",
    "category": "Pottery",
    "price": 1200,
    "images": ["https://example.com/images/terracotta-vase.jpg"],
    "tags": ["handmade", "traditional", "gift"],
    "artisan": "Priya Sharma",
    "location": "Jaipur, Rajasthan",
  },
  
  {
    "_id": "2",
    "name": "Silver Jhumka Earrings",
    "description": "Elegant sterling silver jhumka earrings with detailed filigree work, ideal for festive occasions.",
    "category": "Jewelry",
    "price": 2500,
    "images": ["https://example.com/images/jhumka-earrings.jpg"],
    "tags": ["handmade", "traditional", "premium"],
    "artisan": "Anita Desai",
    "location": "Mumbai, Maharashtra"
  },
  {
    "_id": "3",
    "name": "Handwoven Cotton Saree",
    "description": "A soft, handwoven cotton saree with vibrant block prints, showcasing traditional craftsmanship.",
    "category": "Textiles",
    "price": 3500,
    "images": ["https://example.com/images/cotton-saree.jpg"],
    "tags": ["handmade", "traditional", "eco"],
    "artisan": "Lakshmi Nair",
    "location": "Varanasi, Uttar Pradesh"
  },
  {
    "_id": "4",
    "name": "Rosewood Carved Jewelry Box",
    "description": "A finely carved rosewood jewelry box with brass inlay, perfect for gifting or personal use.",
    "category": "Woodwork",
    "price": 1800,
    "images": ["https://example.com/images/jewelry-box.jpg"],
    "tags": ["handmade", "premium", "gift"],
    "artisan": "Ramesh Patel",
    "location": "Udaipur, Rajasthan"
  },
  {
    "_id": "5",
    "name": "Bamboo Wall Hanging",
    "description": "Eco-friendly bamboo wall hanging with intricate weaves, adding a rustic charm to any space.",
    "category": "Bamboo",
    "price": 900,
    "images": ["https://example.com/images/bamboo-wall-hanging.jpg"],
    "tags": ["handmade", "eco", "gift"],
    "artisan": "Sunita Das",
    "location": "Guwahati, Assam"
  },
  {
    "_id": "6",
    "name": "Clay Kulhad Set (6 Pieces)",
    "description": "Set of six handcrafted clay kulhads, perfect for serving tea or coffee in traditional style.",
    "category": "Pottery",
    "price": 600,
    "images": ["https://example.com/images/clay-kulhad.jpg"],
    "tags": ["handmade", "traditional", "eco"],
    "artisan": "Mohan Lal",
    "location": "Khajuraho, Madhya Pradesh"
  },
  {
    "_id": "7",
    "name": "Kundan Necklace Set",
    "description": "A luxurious kundan necklace set with matching earrings, crafted for bridal or festive wear.",
    "category": "Jewelry",
    "price": 4500,
    "images": ["https://example.com/images/kundan-necklace.jpg"],
    "tags": ["handmade", "premium", "traditional"],
    "artisan": "Neha Gupta",
    "location": "Delhi"
  },
  {
    "_id": "8",
    "name": "Embroidered Silk Cushion Covers",
    "description": "Set of two silk cushion covers with hand-embroidered floral designs, adding elegance to your home.",
    "category": "Textiles",
    "price": 1100,
    "images": ["https://example.com/images/cushion-covers.jpg"],
    "tags": ["handmade", "premium", "gift"],
    "artisan": "Suman Kaur",
    "location": "Amritsar, Punjab"
  },
  {
    "_id": "9",
    "name": "Teak Wood Serving Tray",
    "description": "A sturdy teak wood serving tray with carved handles, ideal for serving guests in style.",
    "category": "Woodwork",
    "price": 2000,
    "images": ["https://example.com/images/serving-tray.jpg"],
    "tags": ["handmade", "eco", "gift"],
    "artisan": "Vijay Kumar",
    "location": "Jodhpur, Rajasthan"
  },
  {
    "_id": "10",
    "name": "Bamboo Table Lamp",
    "description": "A handcrafted bamboo table lamp with a minimalist design, perfect for eco-conscious homes.",
    "category": "Bamboo",
    "price": 1500,
    "images": ["https://example.com/images/bamboo-lamp.jpg"],
    "tags": ["handmade", "eco", "premium"],
    "artisan": "Arjun Gogoi",
    "location": "Dibrugarh, Assam"
  },
  {
    "_id": "11",
    "name": "Blue Pottery Wall Plate",
    "description": "A decorative blue pottery wall plate with traditional motifs, ideal for home decor.",
    "category": "Pottery",
    "price": 800,
    "images": ["https://example.com/images/blue-pottery-plate.jpg"],
    "tags": ["handmade", "traditional", "gift"],
    "artisan": "Kavita Meena",
    "location": "Jaipur, Rajasthan"
  },
  {
    "_id": "12",
    "name": "Oxidized Silver Anklets",
    "description": "Pair of oxidized silver anklets with delicate bells, perfect for daily or festive wear.",
    "category": "Jewelry",
    "price": 1800,
    "images": ["https://example.com/images/silver-anklets.jpg"],
    "tags": ["handmade", "traditional", "gift"],
    "artisan": "Rekha Verma",
    "location": "Ahmedabad, Gujarat"
  },
  {
    "_id": "13",
    "name": "Handwoven Woolen Shawl",
    "description": "A warm, handwoven woolen shawl with intricate patterns, perfect for winter gifting.",
    "category": "Textiles",
    "price": 2800,
    "images": ["https://example.com/images/woolen-shawl.jpg"],
    "tags": ["handmade", "traditional", "premium"],
    "artisan": "Tenzin Dolma",
    "location": "Leh, Ladakh"
  },
  {
    "_id": "14",
    "name": "Sandalwood Carved Idol",
    "description": "A hand-carved sandalwood idol of Lord Ganesha, crafted with precision for spiritual decor.",
    "category": "Woodwork",
    "price": 3200,
    "images": ["https://example.com/images/sandalwood-idol.jpg"],
    "tags": ["handmade", "premium", "gift"],
    "artisan": "Suresh Rao",
    "location": "Mysore, Karnataka"
  },
  {
    "_id": "15",
    "name": "Bamboo Storage Basket",
    "description": "A versatile bamboo storage basket with natural weaves, ideal for organizing household items.",
    "category": "Bamboo",
    "price": 700,
    "images": ["https://example.com/images/bamboo-basket.jpg"],
    "tags": ["handmade", "eco", "gift"],
    "artisan": "Meena Borah",
    "location": "Imphal, Manipur"
  }

];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ApiProduct[]>(initialProducts);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(Math.ceil(initialProducts.length / 24));
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (p = 1) => {
    setLoading(true);
    try {
      let filteredProducts = initialProducts;
      if (q) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(q.toLowerCase()) ||
            product.description.toLowerCase().includes(q.toLowerCase())
        );
      }
      if (category) {
        filteredProducts = filteredProducts.filter(
          (product) => product.category === category
        );
      }
      if (tags.length) {
        filteredProducts = filteredProducts.filter((product) =>
          tags.every((tag) => product.tags?.includes(tag))
        );
      }
      if (minPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= parseFloat(minPrice)
        );
      }
      if (maxPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price <= parseFloat(maxPrice)
        );
      }
      const itemsPerPage = 24;
      const startIndex = (p - 1) * itemsPerPage;
      const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + itemsPerPage
      );
      setProducts(paginatedProducts);
      setPage(p);
      setPages(Math.ceil(filteredProducts.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [q, category, tags, minPrice, maxPrice]);

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        q,
        setQ,
        category,
        setCategory,
        tags,
        setTags,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        page,
        setPage,
        pages,
        setPages,
        loading,
        setLoading,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

export default ProductContext;