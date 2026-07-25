import React, { useEffect } from 'react';
import { X, Heart, ShoppingCart, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext/CartContext';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { wishlist, removeFromWishlist, isLoading, error, refreshWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      toast({ title: 'Added to cart' });
    } catch (e: any) {
      toast({ title: 'Failed to add to cart', description: e.message || 'Try again', variant: 'destructive' });
    }
  };

  const handleAddAll = async () => {
    if (!wishlist?.length) return;
    try {
      for (const w of wishlist) {
        await addToCart(w.productId, 1);
      }
      toast({ title: 'All items added to cart' });
    } catch (e: any) {
      toast({ title: 'Failed to add some items', description: e.message || 'Try again', variant: 'destructive' });
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      toast({ title: 'Removed from wishlist' });
    } catch (e: any) {
      toast({ title: 'Failed to remove', description: e.message || 'Try again', variant: 'destructive' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed right-0 top-0 h-full w-full sm:w-80 md:w-96 lg:w-[28rem] bg-background shadow-2xl flex flex-col z-50"
            role="dialog"
            aria-label="Wishlist"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-beige">
                <Heart className="w-7 h-7 text-rose-500" />
                Wishlist
                {wishlist?.length ? (
                  <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                    {wishlist.length}
                  </Badge>
                ) : null}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={refreshWishlist}
                  disabled={isLoading}
                  className="text-beige hover:text-muddy-brown hover:bg-gray-200 transition-colors"
                  aria-label="Refresh wishlist"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-beige hover:text-muddy-brown hover:bg-gray-200 transition-colors"
                  aria-label="Close wishlist"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" role="list">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <RefreshCw className="w-10 h-10 animate-spin text-beige mb-4" />
                  <p className="text-beige text-lg font-medium">Loading wishlist...</p>
                </div>
              ) : error ? (
                <div className="text-sm text-destructive">{String(error)}</div>
              ) : !wishlist?.length ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Heart className="w-24 h-24 text-beige/50 mb-4" />
                  <h3 className="text-xl font-semibold text-beige">Your wishlist is empty</h3>
                  <p className="text-sm text-gray-400 mt-2 max-w-xs">Browse products and add items to your wishlist to see them here.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {wishlist.map((w) => (
                    <motion.div
                      key={w.productId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                      role="listitem"
                    >
                      <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex items-center justify-center">
                        {w.product?.images?.[0] ? (
                          <img
                            src={w.product.images[0]}
                            alt={w.product?.name || 'Product'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop";
                            }}
                          />
                        ) : (
                          <span className="text-2xl">🏺</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{w.product?.name || 'Product'}</div>
                        {typeof w.product?.price === 'number' && (
                          <div className="text-xs text-muted-foreground">₹{w.product.price}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => handleAddToCart(w.productId)}
                          disabled={isLoading}
                          title="Add to cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-destructive hover:text-destructive"
                          onClick={() => handleRemove(w.productId)}
                          disabled={isLoading}
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {wishlist?.length ? (
              <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {wishlist?.length || 0} item(s)
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={refreshWishlist} disabled={isLoading}>
                    Refresh
                  </Button>
                  <Button size="sm" onClick={handleAddAll} disabled={isLoading}>
                    Add All to Cart
                  </Button>
                </div>
              </div>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;
