import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, ShoppingBag } from "lucide-react";
import { Product, mockProductData } from "@/lib/productData";

interface ChatProductCardProps {
  product?: Product;
  productName: string;
  productUrl: string;
}

export const ChatProductCard: React.FC<ChatProductCardProps> = ({
  product,
  productName,
  productUrl,
}) => {
  const navigate = useNavigate();

  // Find fallback from mock product data if available
  const mockFallback = mockProductData.find(
    (m) =>
      m.name.toLowerCase().includes(productName.toLowerCase()) ||
      productName.toLowerCase().includes(m.name.toLowerCase()) ||
      (product?.name && m.name.toLowerCase() === product.name.toLowerCase()) ||
      m.id === product?.id
  );

  const name = product?.name || mockFallback?.name || productName;
  const price = product?.price || mockFallback?.price || "1,200";
  const artisan = product?.artisan || mockFallback?.artisan || "Local Artisan";
  const location = product?.location || mockFallback?.location || product?.category || "India";
  
  // Resolve rich product image
  let imageUrl = product?.imageUrl || "";
  if (!imageUrl || imageUrl.includes("example.com") || imageUrl.includes("placehold.co")) {
    imageUrl = mockFallback?.imageUrl || "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop";
  }

  // Format URL target properly
  let targetUrl = productUrl || "/products";
  const effectiveId = product?.id || mockFallback?.id;
  if (effectiveId) {
    targetUrl = `/products/${effectiveId}`;
  }

  const handleCardClick = () => {
    navigate(targetUrl);
  };

  return (
    <div
      onClick={handleCardClick}
      className="my-3 flex flex-col sm:flex-row items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-orange-200 dark:border-zinc-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group max-w-md w-full text-foreground"
    >
      <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const fallbackSrc = mockFallback?.imageUrl || "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop";
            if ((e.currentTarget as HTMLImageElement).src !== fallbackSrc) {
              (e.currentTarget as HTMLImageElement).src = fallbackSrc;
            }
          }}
        />
      </div>

      <div className="flex-1 min-w-0 w-full flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate group-hover:text-orange-500 transition-colors">
              {name}
            </h4>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400 flex-shrink-0">
              ₹{price}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
            <span className="truncate">by {artisan} • {location}</span>
          </div>
          
          {(product?.description || mockFallback?.description) && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
              {product?.description || mockFallback?.description}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-gray-100 dark:border-zinc-800">
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <ShoppingBag className="w-3 h-3 text-orange-500" /> Website Product
          </span>
          <Button
            size="sm"
            className="h-7 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-3"
            onClick={(e) => {
              e.stopPropagation();
              navigate(targetUrl);
            }}
          >
            View Product
          </Button>
        </div>
      </div>
    </div>
  );
};
