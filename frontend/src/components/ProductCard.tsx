import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, ShoppingCart, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAlert } from "@/context/alert/AlertContext";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { mockProductData } from "@/lib/productData";

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  artisan: string;
  location: string;
  story: string;
  image?: string;
  images?: string[];
  description?: string;
  materials?: string[];
  rating?: number;
  reviews?: number;
  tags?: string[]; // ✅ added
  onClick?: () => void;
}

export function ProductCard({
  id = '',
  name,
  price,
  artisan,
  location,
  story,
  image,
  images = [],
  description,
  materials = ["Clay", "Natural Glazes"],
  rating = 4,
  reviews = 23,
  tags = [],
  onClick,
}: ProductCardProps) {
  const navigate = useNavigate();
  const [imgIndex, setImgIndex] = useState(0);

  const mockMatch = useMemo(() => {
    return mockProductData.find(
      (m) =>
        (id && m.id === id) ||
        (name && m.name.toLowerCase().includes(name.toLowerCase())) ||
        (name && name.toLowerCase().includes(m.name.toLowerCase()))
    );
  }, [id, name]);

  const candidates = useMemo(() => {
    const defaultFallback = "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop";
    const mockImage = mockMatch?.imageUrl;
    const rawList = [mockImage, image, ...images, defaultFallback];
    const validList = rawList
      .filter((s): s is string => Boolean(s) && typeof s === "string" && !s.includes("example.com") && !s.includes("placehold.co"))
      .map((s) => s.trim());
    return Array.from(new Set(validList));
  }, [image, images, mockMatch]);
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if the click wasn't on a button or link
    if (e.target instanceof Element && (e.target.closest('button') || e.target.closest('a'))) {
      return;
    }
    
    if (onClick) {
      onClick();
    } else if (id) {
      navigate(`/products/${id}`);
    }
  };
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showSuccess, showError } = useAlert();

  const isFavorite = id ? isInWishlist(id) : false;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) {
      showError("Product ID not available");
      return;
    }

    try {
      if (isFavorite) {
        await removeFromWishlist(id);
        showSuccess(`${name} removed from wishlist`);
      } else {
        await addToWishlist(id, {
          _id: id,
          name,
          price,
          category: location,
        });
        showSuccess(`${name} added to wishlist`);
      }
    } catch (error: any) {
      showError(error.message || "Failed to update wishlist");
    }
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) {
      showError("Product ID not available");
      return;
    }

    try {
      await addToCart(id, 1);
      showSuccess(`${name} added to cart`);

      // Save to recent products
      const recentProducts = JSON.parse(localStorage.getItem("recentProducts") || "[]");
      const newRecent = [
        { id, name, price, artisan, location },
        ...recentProducts.filter((p: any) => p.id !== id),
      ].slice(0, 10);
      localStorage.setItem("recentProducts", JSON.stringify(newRecent));
    } catch (err: any) {
      showError(err.message || "Failed to add to cart");
    }
  };

  return (
    <Card
      className="group hover:shadow-warm transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="aspect-square bg-gradient-subtle rounded-t-lg flex items-center justify-center text-6xl relative overflow-hidden">
        {candidates[imgIndex] ? (
          // <img
          //   src={candidates[imgIndex]}
          //   alt={name}
          //   className="w-full h-full object-cover"
          //   loading="lazy"
          //   referrerPolicy="no-referrer"
          //   crossOrigin="anonymous"
          //   onError={(e) => {
          //     // Try next candidate; if none left, show emoji
          //     if (imgIndex + 1 < candidates.length) {
          //       setImgIndex((i) => i + 1);
          //     } else {
          //       e.currentTarget.style.display = 'none';
          //       e.currentTarget.nextElementSibling?.classList.remove('hidden');
          //     }
          //   }}
          // />
          <img
            src={candidates[imgIndex]}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={() => {
              setImgIndex((i) => {
                // Try next candidate; if exhausted, stay at last (which is the Unsplash fallback)
                return i + 1 < candidates.length ? i + 1 : i;
              });
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center absolute inset-0 bg-gradient-subtle ${candidates.length > 0 ? 'hidden' : ''}`}>
          🏺
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleQuickAdd}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        {/* Title + Favorite */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">
            {name}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground hover:text-primary"
              }`}
            />
          </Button>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({reviews})</span>
        </div>

        {/* Story */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{story}</p>

        {/* ✅ Tags - visible only from sm and above */}
        {tags.length > 0 && (
          <div className="hidden sm:flex flex-wrap gap-2 mb-3 max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground whitespace-nowrap"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Price & Artisan */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-primary">₹{price}</p>
            <p className="text-sm text-muted-foreground">by {artisan}</p>
          </div>
          <Badge variant="secondary" className="bg-secondary/50 hidden sm:flex flex-wrap gap-2 mb-3 max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent">
            Handmade
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
