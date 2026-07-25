import { useState, useRef, useEffect } from "react";
import { ChatButton } from "@/components/ChatButton";
import { ChatWindow } from "@/components/ChatWindow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatInterface } from "@/components/ChatInterface";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import {
  Star,
  MapPin,
  Sparkles,
  MessageCircle,
  Users,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  Award,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Filter,
} from "lucide-react";
import heroImage from "@/assets/hero-artisan.jpg";
import processImage from "@/assets/process-image.jpg";
import heroAbout from "@/assets/hero-about.jpg";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import craftsShowcase from "@/assets/crafts-showcase.jpg";
import { useProductContext } from "@/context/ProductContext/ProductContext";
import { apiService } from "@/api/api";

// Define types for products and artisans
interface Product {
  name: string;
  price: number;
  artisan: string;
  location: string;
  story: string;
  description?: string;
  materials?: string[];
  rating?: number;
  reviews?: number;
  image?: string;
}

interface Artisan {
  id: string | number;
  name: string;
  craft: string;
  location: string;
  rating: number;
  reviews: number;
  specialties: string[];
  experience: string;
  description: string;
}

const CATEGORIES = [
  { id: "all", label: "All Crafts", icon: "✨" },
  { id: "Pottery", label: "Pottery", icon: "🏺" },
  { id: "Jewelry", label: "Jewelry", icon: "💎" },
  { id: "Textiles", label: "Textiles", icon: "🧵" },
  { id: "Woodwork", label: "Woodwork", icon: "🪵" },
  { id: "Bamboo", label: "Bamboo", icon: "🎋" },
];

const METRICS = [
  { label: "Verified Artisans", value: "500+", icon: Users, desc: "Empowered craftspeople" },
  { label: "Handcrafted Items", value: "1,500+", icon: ShoppingBag, desc: "Authentic Indian heritage" },
  { label: "Satisfied Buyers", value: "4.9 ★", icon: Award, desc: "Based on 2,400+ reviews" },
  { label: "Indian States", value: "25+", icon: MapPin, desc: "Cultural craft diversity" },
];

const TESTIMONIALS = [
  {
    name: "Meera Sen",
    role: "Verified Buyer",
    location: "Bengaluru",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop",
    quote: "Finding authentic Jaipur blue pottery used to take weeks. With Artist Bazaar's AI assistant, I got connected to Kavita in 30 seconds!",
    rating: 5,
  },
  {
    name: "Ramesh Patel",
    role: "Rosewood Artisan",
    location: "Udaipur, Rajasthan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop",
    quote: "Listing my carved wooden boxes through the AI chat changed my craft business. Buyers from all across India now order directly.",
    rating: 5,
  },
  {
    name: "Ananya Roy",
    role: "Interior Designer",
    location: "Delhi NCR",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop",
    quote: "The product cards and live artisan context in the chatbot make finding traditional textiles effortless and transparent.",
    rating: 5,
  },
];

const heroSlides = [
  {
    id: 1,
    image: heroImage,
    tag: "Artisan Spotlight",
    title: "Priya Sharma • Jaipur Blue Pottery",
    location: "Jaipur, Rajasthan",
    description: "Hand-painting terracotta blue pottery using 300-year-old traditional mineral dye motifs passed down through generations.",
    badge: "Master Craftsperson",
  },
  {
    id: 2,
    image: craftsShowcase,
    tag: "Heritage Handloom",
    title: "Lakshmi Nair • Varanasi Malmal Cotton",
    location: "Varanasi, Uttar Pradesh",
    description: "Pure handwoven Malmal cotton sarees printed with hand-carved wooden block prints and natural indigo dyes.",
    badge: "Eco & Organic Weaves",
  },
  {
    id: 3,
    image: processImage,
    tag: "Traditional Woodcraft",
    title: "Ramesh Patel • Tarkashi Rosewood",
    location: "Udaipur, Rajasthan",
    description: "Fine solid rosewood jewelry boxes embellished with delicate brass wire Tarkashi inlay art.",
    badge: "Heritage Tarkashi",
  },
  {
    id: 4,
    image: heroAbout,
    tag: "Filigree Jewelry",
    title: "Anita Desai • Sterling Silver Jhumkas",
    location: "Mumbai, Maharashtra",
    description: "Elegant 925 sterling silver jhumkas with hand-carved filigree and antique oxidized finish for festive royal wear.",
    badge: "925 Silver Certified",
  },
];

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  const artisanScrollRef = useRef<HTMLDivElement>(null);
  const productScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { products, fetchProducts, loading: productsLoading } = useProductContext();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [artisansLoading, setArtisansLoading] = useState(false);

  // Auto-advance hero carousel every 3 seconds
  useEffect(() => {
    if (isHeroHovered) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isHeroHovered]);

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  // Smooth scroll handler
  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Fetch featured data on mount
  useEffect(() => {
    fetchProducts(1);

    const loadArtisans = async () => {
      setArtisansLoading(true);
      try {
        const result: any = await apiService.getSellersList({ page: "1", limit: "12" });
        const sellerList: any[] = result?.sellers || [];
        const mapped: Artisan[] = sellerList.map((s: any) => ({
          id: s._id,
          name: s.name || s.email || "Artisan",
          craft: s.role || "Artisan",
          location: s.location || "Local",
          rating: 4.8,
          reviews: 24,
          specialties: Array.isArray(s.specialties) ? s.specialties : [],
          experience: s.experience || "",
          description: s.bio || "Talented artisan creating beautiful handmade crafts with traditional techniques.",
        }));
        setArtisans(mapped);
      } catch (err) {
        console.error("Failed to load artisans", err);
        setArtisans([]);
      } finally {
        setArtisansLoading(false);
      }
    };

    loadArtisans();
  }, []);

  // Filtered products based on active category tab
  const filteredProducts = products.filter((p: any) => {
    if (activeCategory === "all") return true;
    return (p?.category || "").toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      <Navbar />

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatButton isOpen={isChatOpen} onClick={() => setIsChatOpen(!isChatOpen)} />
      </div>

      {/* Chat Window Popup */}
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* 🌟 AMAZON-STYLE HERO CAROUSEL BANNER 🌟 */}
      <section 
        id="home" 
        className="relative bg-background pt-4 pb-6 border-b border-border/40"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-orange-500/20 group">
            {/* Top Auto-Progress Timer Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/40 z-30 pointer-events-none">
              <div
                key={currentHeroSlide}
                className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 animate-hero-progress"
              />
            </div>

            {/* Banner Slides Container */}
            <div className="relative h-64 sm:h-80 md:h-[400px] lg:h-[460px] w-full overflow-hidden">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                    idx === currentHeroSlide
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-105 pointer-events-none z-0"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Gradient Overlay for Text & Buttons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-12 text-white">
                    <div className="max-w-2xl space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm px-3 py-1 shadow-md">
                          {slide.tag}
                        </Badge>
                        <span className="text-xs sm:text-sm bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-orange-200">
                          {slide.badge}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-xs sm:text-base text-gray-200 line-clamp-2 max-w-xl drop-shadow">
                        {slide.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button
                          size="lg"
                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition-transform duration-200 hover:scale-105"
                          onClick={() => scrollToSection("products")}
                        >
                          <ShoppingBag className="w-5 h-5 mr-2" />
                          Shop Collection
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="bg-black/40 hover:bg-black/70 border-white/30 hover:border-white text-white font-semibold px-5 py-2.5 rounded-xl backdrop-blur-md transition-all"
                          onClick={() => setIsChatOpen(true)}
                        >
                          <MessageCircle className="w-5 h-5 mr-2 text-orange-400" />
                          Ask AI Assistant
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Glassmorphic Prev/Next Nav Buttons */}
            <button
              onClick={prevHeroSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-orange-500 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl opacity-90 group-hover:opacity-100"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextHeroSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-orange-500 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl opacity-90 group-hover:opacity-100"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Pagination Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHeroSlide(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentHeroSlide
                      ? "w-8 h-2.5 bg-orange-500"
                      : "w-2.5 h-2.5 bg-white/50 hover:bg-white"
                  }`}
                  aria-label={`Go to banner slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Quick Search Badges Bar Below Hero Carousel */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-orange-500" /> Quick Search:
            </span>
            {CATEGORIES.slice(1).map((cat) => (
              <Badge
                key={cat.id}
                variant="outline"
                className="cursor-pointer hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 py-1.5 px-3.5 text-xs sm:text-sm flex items-center gap-1.5 rounded-xl shadow-xs"
                onClick={() => {
                  setActiveCategory(cat.id);
                  scrollToSection("products");
                }}
              >
                <span>{cat.icon}</span> {cat.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* 📊 LIVE IMPACT STATS COUNTER 📊 */}
      <section className="py-10 bg-orange-500/5 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {METRICS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-card border border-border/60 hover:border-orange-500/40 hover:shadow-lg transition-all duration-300 group text-center"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 mb-3">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {item.value}
                  </h3>
                  <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mt-1">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🤖 AI CHAT INTERFACE SECTION 🤖 */}
      <section id="chat" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 mb-3">
              Interactive AI Discovery
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Talk to Our Artisan AI Assistant
            </h2>
            <p className="text-muted-foreground mt-2">
              Ask about product prices, materials, custom designs, or artisan stories. The assistant responds with live catalog data and dynamic product cards!
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-2xl shadow-xl border border-border/80 overflow-hidden bg-card">
            <ChatInterface />
          </div>
        </div>
      </section>

      {/* 🏺 FEATURED PRODUCTS WITH LIVE CATEGORY FILTER 🏺 */}
      <section id="products" className="py-16 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 mb-2">
                Handcrafted Catalog
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                Featured Artisan Products
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Explore genuine handcrafted items with authentic price transparency
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "bg-card hover:bg-orange-500/10 text-foreground border border-border"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Carousel Container */}
          <div className="relative group">
            <div
              ref={productScrollRef}
              className="flex overflow-x-auto gap-6 py-4 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
            >
              {(productsLoading ? Array.from({ length: 8 }) : filteredProducts).map((p: any, index: number) => {
                const image =
                  (Array.isArray(p?.images) && p.images[0]) ||
                  p?.image ||
                  (Array.isArray(p?.imagesData) && p.imagesData[0]?.url) ||
                  undefined;

                const productForCard = {
                  id: p?._id,
                  name: p?.name || "Handcrafted Item",
                  price: p?.price || 0,
                  artisan: p?.artisan || "Local Artisan",
                  location: p?.location || p?.category || "",
                  story: p?.description || "",
                  image,
                  tags: p?.tags || [],
                };

                const productForModal: Product = {
                  name: productForCard.name,
                  price: productForCard.price,
                  artisan: productForCard.artisan,
                  location: productForCard.location,
                  story: productForCard.story,
                  image: productForCard.image,
                };

                return (
                  <div key={p?._id || index} className="flex-none w-72 sm:w-80 snap-center transition-all duration-300">
                    <ProductCard
                      {...productForCard}
                      onClick={() => handleProductClick(productForModal)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Scroll Navigation Buttons */}
            <Button
              size="icon"
              variant="outline"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-card/90 shadow-lg border-border hover:bg-orange-500 hover:text-white transition-all hidden sm:flex"
              onClick={() => scroll(productScrollRef, "left")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-card/90 shadow-lg border-border hover:bg-orange-500 hover:text-white transition-all hidden sm:flex"
              onClick={() => scroll(productScrollRef, "right")}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-flex items-center text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline gap-1 group"
            >
              Browse All Products Catalog <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 🎨 FEATURED ARTISANS CAROUSEL 🎨 */}
      <section id="Artist" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 mb-2">
                Craftspeople Community
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                Meet Our Master Artisans
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Discover local craftsmen and their unique inherited art traditions
              </p>
            </div>
            <Link
              to="/artisans"
              className="text-xs font-semibold text-orange-500 hover:text-orange-600 hover:underline flex items-center gap-1"
            >
              View All Artisans →
            </Link>
          </div>

          <div className="relative">
            <div
              ref={artisanScrollRef}
              className="flex overflow-x-auto gap-6 py-4 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
            >
              {(artisansLoading ? Array.from({ length: 6 }) : artisans).map((artisan, idx) => (
                <Card
                  key={(artisan as Artisan)?.id ?? idx}
                  className="flex-none w-72 sm:w-80 overflow-hidden border-border/60 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all duration-300 group hover:-translate-y-1 snap-center"
                >
                  <div className="aspect-square bg-muted flex items-center justify-center p-4 relative overflow-hidden">
                    <img
                      src={craftsShowcase}
                      alt={`${(artisan as Artisan)?.name || "Artisan"}'s crafts`}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-6 right-6 bg-black/70 text-white text-[10px] backdrop-blur-md">
                      Verified Seller
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground">
                          {(artisan as Artisan)?.name || "Artisan Name"}
                        </CardTitle>
                        <p className="text-orange-500 font-semibold text-xs">
                          {(artisan as Artisan)?.craft || "Artisan Craft"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs bg-amber-500/10 px-2 py-0.5 rounded-md text-amber-600 dark:text-amber-400 font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{(artisan as Artisan)?.rating ?? 4.8}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                      <MapPin className="h-3.5 w-3.5 text-orange-500" />
                      <span>{(artisan as Artisan)?.location || "India"}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    <p className="text-muted-foreground line-clamp-2">
                      {(artisan as Artisan)?.description || "Crafting traditional handmade items with heritage technique."}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(artisan as Artisan)?.specialties?.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-[10px]">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border/40">
                      <Button
                        size="sm"
                        className="flex-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                        onClick={() => navigate(`/profile/${(artisan as Artisan)?.id}`)}
                      >
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs border-orange-500/30 text-foreground hover:bg-orange-500/10 rounded-lg"
                        onClick={() => navigate(`/chat/${(artisan as Artisan)?.id}`)}
                      >
                        <MessageCircle className="h-3.5 w-3.5 mr-1 text-orange-500" />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              size="icon"
              variant="outline"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-card/90 shadow-lg border-border hover:bg-orange-500 hover:text-white transition-all hidden sm:flex"
              onClick={() => scroll(artisanScrollRef, "left")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-card/90 shadow-lg border-border hover:bg-orange-500 hover:text-white transition-all hidden sm:flex"
              onClick={() => scroll(artisanScrollRef, "right")}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 🔄 HOW IT WORKS - 3 STEP INTERACTIVE CARDS 🔄 */}
      <section className="py-16 bg-muted/40 border-y border-border/40">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 mb-3">
            Simple & Transparent
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-12">
            How Artist Bazaar Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all duration-300 space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto text-2xl font-bold group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                💬
              </div>
              <h3 className="text-lg font-bold text-foreground">1. Ask AI Assistant</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Describe your desired craft by material, location, or price range. Our AI dynamically fetches matching products.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all duration-300 space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto text-2xl font-bold group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                🎨
              </div>
              <h3 className="text-lg font-bold text-foreground">2. Connect with Artisan</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Read authentic heritage stories, check verified credentials, and view direct seller details.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all duration-300 space-y-4 group">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto text-2xl font-bold group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                📦
              </div>
              <h3 className="text-lg font-bold text-foreground">3. Support Indian Heritage</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Receive genuine handmade products straight from rural & urban craftsmen across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 VOICE OF COMMUNITY TESTIMONIALS 🌟 */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 mb-2">
              Community Reviews
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Loved by Buyers & Artisans
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic leading-relaxed mb-4">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-orange-500/30"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{t.name}</h4>
                    <p className="text-[11px] text-orange-500 font-semibold">{t.role} • {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 VIBRANT CTA BANNER 🚀 */}
      <section className="py-16 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Explore Authentic Indian Crafts?
          </h2>
          <p className="text-orange-100 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Chat with our AI assistant to discover products by price, location, or material, or list your own crafts today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold shadow-xl rounded-xl px-8"
              onClick={() => setIsChatOpen(true)}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat with AI Assistant
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 rounded-xl px-8"
              onClick={() => navigate("/products")}
            >
              View Full Catalog
            </Button>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
      
      <Footer />
    </div>
  );
};

export default Index;