import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, ArrowLeft, MapPin, Plus, Minus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAlert } from "@/context/alert/AlertContext";
import { useProductContext } from "@/context/ProductContext/ProductContext";
import { ProductCard } from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  // Optional fields from ApiProduct
  artisan?: string;
  location?: string;
  category?: string;
  image?: string;
  images?: string[];
  imagesData?: Array<{ url?: string }>; 
  materials?: string[];
  rating?: number;
  reviews?: number;
  tags?: string[];
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showSuccess, showError } = useAlert();
  const { products } = useProductContext();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // In a real app, you would fetch the product by ID from your API
        // For now, we'll simulate this by finding the product in the existing products
        const foundProduct = products.find(p => p._id === id) as unknown as Product | undefined;
        if (foundProduct) {
          setProduct(foundProduct);
          // Find similar products (same category or tags)
          const similar = products
            .filter(p => 
              p._id !== id && 
              (
                p.category === foundProduct.category ||
                (p.tags && foundProduct.tags && p.tags.some(tag => foundProduct.tags!.includes(tag)))
              )
            )
            .slice(0, 4) as unknown as Product[]; // Show max 4 similar products
          setSimilarProducts(similar as Product[]);
        } else {
          // If product not found, redirect to products page
          navigate('/products');
          showError('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        showError('Failed to load product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, products, navigate, showError]);

  // Build gallery images from any available product image fields
  const galleryImages = useMemo(() => {
    if (!product) return [] as string[];
    const fromImages = Array.isArray(product.images) ? (product.images.filter(Boolean) as string[]) : [];
    const fromImage = product.image ? [product.image] : [];
    const fromImagesData = Array.isArray(product.imagesData)
      ? ((product.imagesData
          .map((i) => (i && i.url ? i.url : undefined))
          .filter(Boolean)) as string[])
      : [];
    const merged = [...fromImages, ...fromImage, ...fromImagesData];
    // Deduplicate while keeping order
    return Array.from(new Set(merged));
  }, [product]);

  // Reset selected image when product or gallery changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?._id]);

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  const openZoom = () => {
    setZoomOpen(true);
    setZoomScale(1);
    setOffset({ x: 0, y: 0 });
  };
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoomScale((s) => clamp(Number((s + delta).toFixed(2)), 1, 4));
  };
  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (zoomScale === 1) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isPanning) return;
    setOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  };
  const endPan = () => setIsPanning(false);
  const zoomIn = () => setZoomScale((s) => clamp(Number((s + 0.2).toFixed(2)), 1, 4));
  const zoomOut = () => setZoomScale((s) => clamp(Number((s - 0.2).toFixed(2)), 1, 4));
  const resetZoom = () => {
    setZoomScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product._id, quantity);
      showSuccess(`${product.name} added to cart`);
    } catch (err: any) {
      showError(err.message || 'Failed to add to cart');
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;
    
    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
        showSuccess('Removed from wishlist');
      } else {
        await addToWishlist(product._id, {
          _id: product._id,
          name: product.name,
          price: product.price,
          category: product.category || '',
        });
        showSuccess('Added to wishlist');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foreground/5">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Button>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images Gallery */}
        <div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img
              src={galleryImages[selectedImageIndex] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop'}
              alt={product.name}
              className="w-full aspect-square object-cover cursor-zoom-in"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                const fallback = "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop";
                if (target.src !== fallback) {
                  target.src = fallback;
                }
              }}
              onClick={openZoom}
            />
          </div>
          {galleryImages.length > 1 && (
            <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={img + idx}
                  className={`relative rounded-lg overflow-hidden border ${
                    idx === selectedImageIndex ? 'border-primary ring-2 ring-primary/40' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImageIndex(idx)}
                  aria-label={`Select image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx + 1}`}
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      const fallback = "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop";
                      if (target.src !== fallback) {
                        target.src = fallback;
                      }
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  ({product.reviews || 0} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="text-3xl font-bold text-gray-900">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </div>

          <div className="text-gray-700">
            {product.description && product.description.length > 220 ? (
              <>
                <p>
                  {showFullDesc ? product.description : `${product.description.slice(0, 220)}...`}
                </p>
                <button
                  className="text-primary mt-2 text-sm"
                  onClick={() => setShowFullDesc((v) => !v)}
                >
                  {showFullDesc ? 'Read less' : 'Read more'}
                </button>
              </>
            ) : (
              <p>{product.description}</p>
            )}
          </div>

          {product.materials && product.materials.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900">Materials</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.materials.map((material) => (
                  <Badge key={material} variant="outline">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{product.location || product.category}</span>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10"
              >
                -
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="h-10 w-10"
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg" 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1"
              onClick={toggleWishlist}
            >
              <Heart 
                className={`mr-2 h-5 w-5 ${isInWishlist(product._id) ? 'fill-current text-red-500' : ''}`} 
              />
              {isInWishlist(product._id) ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.map((item) => (
              <ProductCard
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                artisan={item.artisan || 'Local Artisan'}
                location={item.location || item.category || 'Handmade'}
                story={item.description}
                image={item.images?.[0] || item.image || item.imagesData?.[0]?.url}
                rating={item.rating}
                reviews={item.reviews}
                tags={item.tags}
                onClick={() => navigate(`/products/${item._id}`)}
              />
            ))}
          </div>
        </div>
      )}
      
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black/95">
          <div
            className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden select-none"
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={endPan}
            onMouseLeave={endPan}
          >
            <img
              src={galleryImages[selectedImageIndex] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop'}
              alt={product.name}
              draggable={false}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${zoomScale > 1 ? 'cursor-grabbing' : 'cursor-zoom-in'}`}
              style={{ transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoomScale})` }}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                const fallback = "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop";
                if (target.src !== fallback) {
                  target.src = fallback;
                }
              }}
              onDoubleClick={() => {
                if (zoomScale === 1) {
                  setZoomScale(2);
                } else {
                  setZoomScale(1);
                  setOffset({ x: 0, y: 0 });
                }
              }}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <Button variant="secondary" size="icon" onClick={zoomOut} aria-label="Zoom out">
                <Minus className="h-4 w-4" />
              </Button>
              <div className="px-3 py-1 text-white bg-black/60 rounded-md text-sm">{Math.round(zoomScale * 100)}%</div>
              <Button variant="secondary" size="icon" onClick={zoomIn} aria-label="Zoom in">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={resetZoom} className="ml-2" aria-label="Reset zoom">
                Reset
              </Button>
            </div>
            {galleryImages.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 p-2 rounded-lg">
                {galleryImages.map((img, idx) => (
                  <button
                    key={img + idx}
                    className={`h-14 w-14 rounded-md overflow-hidden border ${idx === selectedImageIndex ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => { setSelectedImageIndex(idx); resetZoom(); }}
                  >
                    <img
                      src={img}
                      alt={`Slide ${idx + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        const fallback = "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop";
                        if (target.src !== fallback) {
                          target.src = fallback;
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
            <button
              className="absolute top-3 right-3 text-white/90 hover:text-white"
              onClick={() => setZoomOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
