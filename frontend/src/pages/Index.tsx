import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatInterface } from "@/components/ChatInterface";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { Star, MapPin, Sparkles, MessageCircle, Users, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-artisan.jpg";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import craftsShowcase from "@/assets/crafts-showcase.jpg";

// Define types for products and artisans
interface Product {
  name: string;
  price: number;
  artisan: string;
  location: string;
  story: string;
  description: string;
  materials: string[];
  rating: number;
  reviews: number;
}

interface Artisan {
  id: number;
  name: string;
  craft: string;
  location: string;
  rating: number;
  reviews: number;
  specialties: string[];
  experience: string;
  description: string;
}

const featuredProducts: Product[] = [
  {
    name: "Handmade Pottery Bowl",
    price: 800,
    artisan: "Asha Devi",
    location: "Jaipur",
    story: "Traditional blue pottery technique passed down through generations",
    description: "Beautiful handcrafted pottery bowl made using traditional Jaipur blue pottery techniques. Each piece is unique and represents centuries of artistic heritage.",
    materials: ["Blue Clay", "Natural Glazes", "Copper Oxide"],
    rating: 5,
    reviews: 34,
  },
  {
    name: "Bamboo Basket Set",
    price: 500,
    artisan: "Ramesh Kumar",
    location: "Assam",
    story: "Sustainable bamboo weaving supporting local forest communities",
    description: "Eco-friendly bamboo basket set perfect for storage and organization. Handwoven by skilled artisans using sustainable bamboo harvesting practices.",
    materials: ["Bamboo", "Natural Dyes", "Cotton Binding"],
    rating: 4,
    reviews: 18,
  },
  {
    name: "Silver Jhumka Earrings",
    price: 1200,
    artisan: "Meera Sharma",
    location: "Udaipur",
    story: "Intricate silver work inspired by Rajasthani heritage",
    description: "Exquisite silver jhumka earrings featuring traditional Rajasthani motifs. Each piece is carefully crafted by master silversmiths.",
    materials: ["Sterling Silver", "Traditional Gemstones", "Gold Plating"],
    rating: 5,
    reviews: 27,
  },
 
  {
    name: "Madhubani Painting",
    price: 2500,
    artisan: "Sita Devi",
    location: "Madhubani, Bihar",
    story: "Hand-painted masterpiece inspired by ancient Mithila traditions",
    description: "Authentic Madhubani painting featuring natural dyes and intricate folk motifs, passed down through generations of women artists.",
    materials: ["Handmade Paper", "Natural Dyes", "Bamboo Brushes"],
    rating: 5,
    reviews: 42,
  },
  {
    name: "Pashmina Shawl",
    price: 3500,
    artisan: "Bilal Ahmed",
    location: "Srinagar, Kashmir",
    story: "Handwoven luxury crafted from the finest Himalayan wool",
    description: "Elegant Pashmina shawl woven by Kashmiri artisans, combining warmth and beauty with timeless embroidery designs.",
    materials: ["Pashmina Wool", "Natural Dyes", "Hand Embroidery"],
    rating: 5,
    reviews: 67,
  },
  {
    name: "Terracotta Horse Figurine",
    price: 900,
    artisan: "Karthik Subramanian",
    location: "Bankura, West Bengal",
    story: "Iconic terracotta craft symbolizing prosperity and heritage",
    description: "Traditional Bankura horse crafted from natural terracotta clay, showcasing intricate carving and detailing.",
    materials: ["Terracotta Clay", "Natural Red Oxide", "Hand Carving Tools"],
    rating: 4,
    reviews: 23,
  },
  {
    name: "Kathakali Wooden Mask",
    price: 1800,
    artisan: "Anand Nair",
    location: "Kerala",
    story: "Hand-painted wooden mask inspired by classical Kathakali dance",
    description: "Colorful wooden mask showcasing expressive facial features of Kathakali performers, crafted by Kerala artisans.",
    materials: ["Wood", "Natural Paints", "Coconut Shell Brushes"],
    rating: 4,
    reviews: 31,
  },
  {
    name: "Bidriware Jewelry Box",
    price: 2200,
    artisan: "Salim Khan",
    location: "Bidar, Karnataka",
    story: "Rare craft of inlaying silver into blackened alloy",
    description: "Elegant Bidriware jewelry box with intricate silver inlay patterns, representing the centuries-old Deccan tradition.",
    materials: ["Zinc-Copper Alloy", "Pure Silver", "Natural Oxidizing Agents"],
    rating: 5,
    reviews: 40,
  },
];

const artisans: Artisan[] = [
  {
    id: 1,
    name: "Ravi Kumar",
    craft: "Pottery",
    location: "Jaipur, Rajasthan",
    rating: 4.8,
    reviews: 124,
    specialties: ["Traditional Pottery", "Blue Pottery", "Terracotta"],
    experience: "15+ years",
    description: "Master potter specializing in traditional Rajasthani blue pottery techniques passed down through generations.",
  },
  {
    id: 2,
    name: "Meera Devi",
    craft: "Textiles",
    location: "Varanasi, UP",
    rating: 4.9,
    reviews: 89,
    specialties: ["Silk Weaving", "Banarasi Sarees", "Traditional Patterns"],
    experience: "20+ years",
    description:
      "Expert weaver creating exquisite Banarasi silk sarees with intricate gold and silver thread work.",
  },
  {
    id: 3,
    name: "Arjun Singh",
    craft: "Woodcarving",
    location: "Udaipur, Rajasthan",
    rating: 4.7,
    reviews: 156,
    specialties: ["Furniture", "Decorative Items", "Temple Art"],
    experience: "12+ years",
    description:
      "Skilled woodcarver creating beautiful furniture and decorative pieces with traditional Rajasthani motifs.",
  },
  {
    id: 4,
    name: "Sita Devi",
    craft: "Madhubani Painting",
    location: "Madhubani, Bihar",
    rating: 5.0,
    reviews: 142,
    specialties: ["Mithila Folk Art", "Natural Dye Painting", "Cultural Storytelling"],
    experience: "25+ years",
    description:
      "Renowned artist preserving the heritage of Madhubani painting using natural dyes and handmade paper.",
  },
  {
    id: 5,
    name: "Bilal Ahmed",
    craft: "Pashmina Weaving",
    location: "Srinagar, Kashmir",
    rating: 4.9,
    reviews: 110,
    specialties: ["Pashmina Shawls", "Hand Embroidery", "Traditional Kashmiri Designs"],
    experience: "18+ years",
    description:
      "Master craftsman weaving luxurious Pashmina shawls with intricate Kashmiri embroidery.",
  },
  {
    id: 6,
    name: "Karthik Subramanian",
    craft: "Terracotta Sculpting",
    location: "Bankura, West Bengal",
    rating: 4.6,
    reviews: 95,
    specialties: ["Terracotta Figurines", "Bankura Horses", "Clay Sculptures"],
    experience: "14+ years",
    description:
      "Terracotta artisan known for iconic Bankura horses and temple-inspired clay figurines.",
  },
  {
    id: 7,
    name: "Anand Nair",
    craft: "Wooden Mask Making",
    location: "Kerala",
    rating: 4.7,
    reviews: 77,
    specialties: ["Kathakali Masks", "Wood Carving", "Hand Painting"],
    experience: "16+ years",
    description:
      "Traditional craftsman creating expressive wooden Kathakali masks painted with vibrant natural pigments.",
  },
  {
    id: 8,
    name: "Salim Khan",
    craft: "Bidriware",
    location: "Bidar, Karnataka",
    rating: 5.0,
    reviews: 134,
    specialties: ["Silver Inlay Work", "Jewelry Boxes", "Deccan Art"],
    experience: "22+ years",
    description:
      "Expert artisan specializing in Bidriware with stunning silver inlay designs on dark metal alloys.",
  },

];

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const artisanScrollRef = useRef<HTMLDivElement>(null);
  const productScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Smooth scroll handler
  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300, // scroll amount
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

  return (
    <div className="min-h-screen w-full bg-gradient-subtles">
      <Navbar />
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Marketplace
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-float">
              Discover Local
              <span className="block bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
                Artisan Crafts
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Connect with talented local artisans through our AI assistant.
              Discover unique handmade products or learn how to showcase your own crafts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-glow">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chatting
              </Button>
              <Button size="lg" variant="outline" className="bg-primary border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Users className="w-5 h-5 mr-2" />
                For Artisans
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section id="chat" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Talk to Our AI Assistant
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ask about products, pricing, artisan stories, or get guidance on listing your own crafts.
              Our AI understands both customers and artisans.
            </p>
          </div>
          <ChatInterface />
        </div>
      </section>

      {/* Featured Artisans */}
      <div id="Artist" className="mb-12 pt-7 relative ">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center">
          Featured Artisan
        </h2>
        <p className="text-lg text-muted-foreground text-center pb-4">
          Discover local artisans and there unique handcrafted
        </p>
        {/* Scrollable horizontal container */}
        <div
          ref={artisanScrollRef}
          className="flex overflow-x-auto gap-8 py-4 px-2 scroll-smooth snap-x snap-mandatory "
          style={{ scrollPadding: "0.5rem" }}
        >
          {artisans.map((artisan) => (
            <Card
              key={artisan.id}
              className="flex-none w-80 overflow-hidden shadow-elegant hover:shadow-warm transition spring group hover:-translate-y-1 snap-center"
            >
              <div className="aspect-square bg-gradient-warm/10 flex items-center justify-center p-8">
                <img
                  src={craftsShowcase}
                  alt={`${artisan.name}'s crafts`}
                  className="w-full h-full object-cover rounded-lg shadow-elegant group-hover:scale-105 transition spring"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{artisan.name}</CardTitle>
                    <p className="text-primary font-semibold">{artisan.craft}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{artisan.rating}</span>
                    <span className="text-muted-foreground">({artisan.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{artisan.location}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{artisan.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Experience:</span>
                    <span className="text-primary">{artisan.experience}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {artisan.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1" onClick={() => navigate(`/profile/${artisan.id}`)}>
                    View Profile
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => navigate(`/chat/${artisan.id}`)}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Floating scroll buttons for artisans */}
        <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4">
          <Button size="icon" variant="secondary" onClick={() => scroll(artisanScrollRef, "left")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="secondary" onClick={() => scroll(artisanScrollRef, "right")}>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Browse all */}
        <div className="text-center mt-4 mb-7">
          <Link to="/artists" className="text-blue-600 underline">Browse all Artisan →</Link>
        </div>
      </div>

      {/* Featured Products */}
      <section id="products" className="py-16 bg-card relative ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Featured Artisan Products
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover unique handcrafted items from talented local artisans
            </p>
          </div>
          {/* Scrollable horizontal container for products */}
          <div
            ref={productScrollRef}
            className="flex overflow-x-auto gap-8 py-4 px-2 scroll-smooth snap-x snap-mandatory"
            style={{ scrollPadding: "1rem" }}
          >
            {featuredProducts.map((product, index) => (
              <div
                key={index}
                className="flex-none w-80 snap-center"
              >
                <ProductCard {...product} onClick={() => handleProductClick(product)} />
              </div>
            ))}
          </div>

          {/* Floating scroll buttons for products */}
          <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4 ">
            <Button size="icon" variant="secondary" onClick={() => scroll(productScrollRef, "left")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="secondary" onClick={() => scroll(productScrollRef, "right")}>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-center mt-4 mb-7">
            <Link to="/products" className="text-blue-600 underline">Browse all products →</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="about" className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-12">
            Preserving Culture with Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto shadow-warm">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">AI-Powered Matching</h3>
              <p className="text-muted-foreground">
                Smart algorithms connect buyers with the perfect artisan based on craft type, style, and requirements.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Artisan Support</h3>
              <p className="text-muted-foreground">
                Get guidance on listing products and building your marketplace presence.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto shadow-elegant">
                <span className="text-2xl">📖</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Storytelling</h3>
              <p className="text-muted-foreground">
                Help artisans share the rich heritage and traditional techniques behind their beautiful crafts.
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto shadow-glow">
                <ShoppingBag className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Direct Connection</h3>
              <p className="text-muted-foreground">
                Connect directly with artisans and learn the stories behind each craft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <section id="about">
        <ProductDetailModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
      </section>
      <Footer />
    </div>
  );
};

export default Index;