// Mock product database for Artist Bazaar
import terracottaVase from "@/assets/terracotta-vase.jpg";
import silverJhumka from "@/assets/silver-jhumka.jpg";
import cottonSaree from "@/assets/cotton-saree.jpg";
import rosewoodBox from "@/assets/rosewood-box.jpg";
import bambooWallHanging from "@/assets/bamboo-wall-hanging.jpg";
import clayKulhad from "@/assets/clay-kulhad.jpg";
import kundanNecklace from "@/assets/kundan-necklace.jpg";
import silkCushion from "@/assets/silk-cushion.jpg";
import teakTray from "@/assets/teak-tray.jpg";
import bambooLamp from "@/assets/bamboo-lamp.jpg";
import bluePottery from "@/assets/blue-pottery.jpg";
import silverAnklets from "@/assets/silver-anklets.jpg";
import woolenShawl from "@/assets/woolen-shawl.jpg";
import sandalwoodGanesha from "@/assets/sandalwood-ganesha.jpg";
import bambooBasket from "@/assets/bamboo-basket.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  artisan: string;
  location: string;
  tags: string[];
  url: string;
  imageUrl: string;
}

const rawProductData = [
  {
    _id: "1",
    name: "Hand-Painted Terracotta Vase",
    description: "A beautifully hand-painted terracotta vase crafted from natural river clay using centuries-old pottery wheels. Painted with organic mineral dyes in traditional Rajasthani floral motifs.",
    category: "Pottery",
    price: 1200,
    tags: ["handmade", "terracotta", "traditional", "home decor"],
    artisan: "Priya Sharma",
    location: "Jaipur, Rajasthan",
    images: [terracottaVase],
  },
  {
    _id: "2",
    name: "Silver Jhumka Earrings",
    description: "Elegant sterling 925 silver jhumka earrings featuring hand-carved filigree work, small dangling silver beads, and antique oxidation finish for festive occasions.",
    category: "Jewelry",
    price: 2500,
    tags: ["handmade", "silver", "jhumka", "traditional"],
    artisan: "Anita Desai",
    location: "Mumbai, Maharashtra",
    images: [silverJhumka],
  },
  {
    _id: "3",
    name: "Handwoven Cotton Saree",
    description: "Pure handwoven Malmal cotton saree with hand-carved wooden block prints using eco-friendly natural indigo dye. Light, breathable, and rich in heritage.",
    category: "Textiles",
    price: 3500,
    tags: ["handmade", "cotton saree", "blockprint", "eco-friendly"],
    artisan: "Lakshmi Nair",
    location: "Varanasi, Uttar Pradesh",
    images: [cottonSaree],
  },
  {
    _id: "4",
    name: "Rosewood Carved Jewelry Box",
    description: "Handcrafted solid rosewood jewelry box adorned with intricate brass wire inlay (Tarkashi art) and plush velvet lining to preserve precious jewelry.",
    category: "Woodwork",
    price: 1800,
    tags: ["handmade", "rosewood", "carved", "brass inlay"],
    artisan: "Ramesh Patel",
    location: "Udaipur, Rajasthan",
    images: [rosewoodBox],
  },
  {
    _id: "5",
    name: "Bamboo Wall Hanging",
    description: "Eco-friendly hand-woven bamboo wall hanging art featuring intricate lattice weaving techniques practiced by indigenous artisans in Assam.",
    category: "Bamboo",
    price: 900,
    tags: ["handmade", "bamboo", "wall art", "sustainable"],
    artisan: "Sunita Das",
    location: "Guwahati, Assam",
    images: [bambooWallHanging],
  },
  {
    _id: "6",
    name: "Clay Kulhad Set (6 Pieces)",
    description: "Set of six unglazed clay kulhads baked in traditional wood furnaces. Adds authentic earthy aroma (Sondhi Khushboo) to chai and beverage serving.",
    category: "Pottery",
    price: 600,
    tags: ["handmade", "clay kulhad", "traditional", "tea set"],
    artisan: "Mohan Lal",
    location: "Khajuraho, Madhya Pradesh",
    images: [clayKulhad],
  },
  {
    _id: "7",
    name: "Kundan Necklace Set",
    description: "Royal Kundan bridal necklace set crafted with hand-set glass stones, faux pearls, and green enamel Meenakari detailing on the reverse side.",
    category: "Jewelry",
    price: 4500,
    tags: ["handmade", "kundan", "necklace", "bridal"],
    artisan: "Neha Gupta",
    location: "Chandni Chowk, Delhi",
    images: [kundanNecklace],
  },
  {
    _id: "8",
    name: "Embroidered Silk Cushion Covers",
    description: "Set of two raw silk cushion covers showcasing hand-embroidered Phulkari floral threadwork crafted by women artisan collectives.",
    category: "Textiles",
    price: 1100,
    tags: ["handmade", "silk cushion", "embroidery", "phulkari"],
    artisan: "Suman Kaur",
    location: "Amritsar, Punjab",
    images: [silkCushion],
  },
  {
    _id: "9",
    name: "Teak Wood Serving Tray",
    description: "Solid seasoned teak wood serving tray with hand-carved floral side handles and smooth protective food-safe oil finish.",
    category: "Woodwork",
    price: 2000,
    tags: ["handmade", "teak wood", "serving tray", "kitchenware"],
    artisan: "Vijay Kumar",
    location: "Jodhpur, Rajasthan",
    images: [teakTray],
  },
  {
    _id: "10",
    name: "Bamboo Table Lamp",
    description: "Minimalist handcrafted bamboo cylinder table lamp that casts warm ambient geometric light patterns across the room when lit.",
    category: "Bamboo",
    price: 1500,
    tags: ["handmade", "bamboo lamp", "lighting", "eco-friendly"],
    artisan: "Arjun Gogoi",
    location: "Dibrugarh, Assam",
    images: [bambooLamp],
  },
  {
    _id: "11",
    name: "Blue Pottery Wall Plate",
    description: "Authentic GI-tagged Jaipur Blue Pottery wall plate made without clay (quartz powder glass technique), decorated with cobalt blue traditional motifs.",
    category: "Pottery",
    price: 800,
    tags: ["handmade", "blue pottery", "wall plate", "jaipur art"],
    artisan: "Kavita Meena",
    location: "Jaipur, Rajasthan",
    images: [bluePottery],
  },
  {
    _id: "12",
    name: "Oxidized Silver Anklets",
    description: "Handmade pair of flexible oxidized silver payal/anklets with delicate silver ghungroo bells that make a gentle musical chime.",
    category: "Jewelry",
    price: 1800,
    tags: ["handmade", "silver anklets", "payal", "traditional"],
    artisan: "Rekha Verma",
    location: "Ahmedabad, Gujarat",
    images: [silverAnklets],
  },
  {
    _id: "13",
    name: "Handwoven Woolen Shawl",
    description: "Luxurious handwoven Pashmina-mix woolen shawl from Ladakh, featuring hand-embroidered border weaves for cold winter warmth.",
    category: "Textiles",
    price: 2800,
    tags: ["handmade", "woolen shawl", "pashmina", "ladakh"],
    artisan: "Tenzin Dolma",
    location: "Leh, Ladakh",
    images: [woolenShawl],
  },
  {
    _id: "14",
    name: "Sandalwood Carved Idol",
    description: "Intricately hand-carved natural fragrant Mysuru sandalwood idol of Lord Ganesha, radiating calming natural sandalwood scent.",
    category: "Woodwork",
    price: 3200,
    tags: ["handmade", "sandalwood", "ganesha idol", "sculpture"],
    artisan: "Suresh Rao",
    location: "Mysore, Karnataka",
    images: [sandalwoodGanesha],
  },
  {
    _id: "15",
    name: "Bamboo Storage Basket",
    description: "Multi-purpose hand-woven bamboo storage hamper with lid, crafted from cured golden bamboo strips for durable eco-friendly home organization.",
    category: "Bamboo",
    price: 700,
    tags: ["handmade", "bamboo basket", "storage", "sustainable"],
    artisan: "Meena Borah",
    location: "Imphal, Manipur",
    images: [bambooBasket],
  },
];

const createUrlSlug = (name: string, id: string) => {
  return `/products/${id}`;
};

export const mockProductData: Product[] = rawProductData.map((p) => ({
  id: p._id,
  name: p.name.replace(/<\/?selection-tag>/g, ""),
  description: p.description,
  price: "" + p.price.toLocaleString("en-IN"),
  category: p.category,
  artisan: p.artisan,
  location: p.location,
  tags: p.tags,
  url: createUrlSlug(p.name, p._id),
  imageUrl: p.images?.[0] || "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop",
}));
