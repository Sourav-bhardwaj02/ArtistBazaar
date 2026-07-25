// import React from 'react';
// import { X, Plus, Minus, Trash2, ShoppingBag, RefreshCw, AlertCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { useToast } from '@/hooks/use-toast';
// import { useCart } from '@/context/CartContext/CartContext';

// interface CartItem {
//   productId: string;
//   quantity: number;
//   priceSnapshot: number;
//   product?: {
//     _id: string;
//     name: string;
//     price: number;
//     images?: string[];
//   };
// }

// interface CartSidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const CartSidebar: React.FC<CartSidebarProps> = ({
//   isOpen,
//   onClose
// }) => {
//   const { toast } = useToast();
//   const { 
//     cart, 
//     updateCartQuantity, 
//     removeFromCart, 
//     isLoading, 
//     error, 
//     refreshCart 
//   } = useCart();

//   const formatPrice = (v: number) =>
//     new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);

//   const handleQuantityChange = async (productId: string, newQuantity: number) => {
//     try {
//       await updateCartQuantity(productId, newQuantity);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update quantity",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleRemoveItem = async (productId: string) => {
//     try {
//       await removeFromCart(productId);
//       toast({
//         title: "Item removed",
//         description: "Item has been removed from your cart"
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to remove item",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleRefresh = async () => {
//     try {
//       await refreshCart();
//       toast({
//         title: "Cart refreshed",
//         description: "Your cart has been updated"
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to refresh cart",
//         variant: "destructive"
//       });
//     }
//   };

//   const getTotal = () => {
//     if (!cart || cart.length === 0) return 0;
//     return cart.reduce((total, item) => total + (item.priceSnapshot * item.quantity), 0);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
//         onClick={onClose}
//       />
      
//       {/* Sidebar */}
//       <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="flex items-center justify-between p-4 border-b">
//             <h2 className="text-lg font-semibold flex items-center gap-2">
//               <ShoppingBag className="w-5 h-5" />
//               Shopping Cart
//               {cart && cart.length > 0 && (
//                 <Badge variant="secondary" className="ml-2">
//                   {cart.reduce((total, item) => total + item.quantity, 0)}
//                 </Badge>
//               )}
//             </h2>
//             <div className="flex items-center gap-2">
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 onClick={handleRefresh}
//                 disabled={isLoading}
//               >
//                 <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
//               </Button>
//               <Button variant="ghost" size="icon" onClick={onClose} disabled={isLoading}>
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Error Display */}
//           {error && (
//             <div className="p-4">
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>
//                   {error}
//                   <Button 
//                     variant="outline" 
//                     size="sm" 
//                     className="ml-2"
//                     onClick={handleRefresh}
//                     disabled={isLoading}
//                   >
//                     Retry
//                   </Button>
//                 </AlertDescription>
//               </Alert>
//             </div>
//           )}

//           {/* Cart Items */}
//           <div className="flex-1 overflow-y-auto p-4">
//             {isLoading ? (
//               <div className="flex flex-col items-center justify-center h-full text-center">
//                 <RefreshCw className="w-8 h-8 text-muted-foreground mb-4 animate-spin" />
//                 <h3 className="text-lg font-medium text-muted-foreground mb-2">
//                   Loading cart...
//                 </h3>
//               </div>
//             ) : !cart || cart.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-full text-center">
//                 <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
//                 <h3 className="text-lg font-medium text-muted-foreground mb-2">
//                   Your cart is empty
//                 </h3>
//                 <p className="text-sm text-muted-foreground">
//                   Add some products to get started
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {cart.map((item) => (
//                   <div key={item.productId} className="flex items-center gap-3 p-3 border rounded-lg">
//                     {/* Product Image */}
//                     <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center overflow-hidden">
//                       {item.product?.images?.[0] ? (
//                         <img 
//                           src={item.product.images[0]} 
//                           alt={item.product.name}
//                           className="w-full h-full object-cover"
//                           onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
//                         />
//                       ) : (
//                         <span className="text-2xl">🏺</span>
//                       )}
//                     </div>
                    
//                     {/* Product Info */}
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-medium text-sm truncate">
//                         {item.product?.name || 'Product'}
//                       </h4>
//                       <div className="text-xs text-muted-foreground">
//                         Price: {formatPrice(item.priceSnapshot)}
//                       </div>
//                       <div className="text-xs text-muted-foreground">
//                         Subtotal: {formatPrice(item.priceSnapshot * item.quantity)}
//                       </div>
//                     </div>

//                     {/* Quantity Controls */}
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="w-8 h-8"
//                         onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
//                         disabled={item.quantity <= 1 || isLoading}
//                       >
//                         <Minus className="w-3 h-3" />
//                       </Button>
//                       <span className="w-8 text-center text-sm font-medium">
//                         {item.quantity}
//                       </span>
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="w-8 h-8"
//                         onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
//                         disabled={isLoading}
//                       >
//                         <Plus className="w-3 h-3" />
//                       </Button>
//                     </div>

//                     {/* Remove Button */}
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="w-8 h-8 text-destructive hover:text-destructive"
//                       onClick={() => handleRemoveItem(item.productId)}
//                       disabled={isLoading}
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           {cart && cart.length > 0 && (
//             <div className="border-t p-4 space-y-4">
//               <div className="flex justify-between items-center text-lg font-semibold">
//                 <span>Total:</span>
//                 <span>{formatPrice(getTotal())}</span>
//               </div>
//               <Button 
//                 className="w-full" 
//                 size="lg"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   'Proceed to Checkout'
//                 )}
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartSidebar;
import React, { useMemo } from 'react';
import {
  X, Plus, Minus, Trash2, ShoppingCart, RefreshCw, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  productId: string;
  quantity: number;
  priceSnapshot: number;
  product?: {
    _id: string;
    name: string;
    price: number;
  };
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatPrice = (v: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(v);

const CartItemCard: React.FC<{
  item: CartItem;
  isLoading: boolean;
  onQuantityChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}> = ({ item, isLoading, onQuantityChange, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
    role="listitem"
  >
    {/* Product Info */}
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-lg md:text-xl text-beige truncate group-hover:text-muddy-brown transition-colors">
        {item.product?.name || 'Unnamed Product'}
      </h4>
      <p className="text-sm text-gray-400">
        {formatPrice(item.priceSnapshot)} × {item.quantity}
      </p>
      <p className="text-lg font-bold text-beige">
        {formatPrice(item.priceSnapshot * item.quantity)}
      </p>
    </div>

    {/* Controls */}
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-beige hover:text-muddy-brown hover:bg-gray-200 transition-colors"
          onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          disabled={isLoading}
          aria-label={`Increase quantity of ${item.product?.name || 'product'}`}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium text-beige w-8 text-center">
          {item.quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-beige hover:text-muddy-brown hover:bg-gray-200 transition-colors"
          onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
          disabled={isLoading || item.quantity <= 1}
          aria-label={`Decrease quantity of ${item.product?.name || 'product'}`}
        >
          <Minus className="w-4 h-4" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 text-beige hover:text-muddy-brown hover:bg-red-100 transition-colors"
        onClick={() => onRemove(item.productId)}
        disabled={isLoading}
        aria-label={`Remove ${item.product?.name || 'product'} from cart`}
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  </motion.div>
);

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    isLoading,
    error,
    refreshCart
  } = useCart();

  const handleQuantityChange = async (id: string, qty: number) => {
    try {
      if (qty < 1) {
        await removeFromCart(id);
        toast({ title: "Item removed", description: "Item has been removed from your cart" });
      } else {
        await updateCartQuantity(id, qty);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update cart",
        variant: "destructive"
      });
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart(id);
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart"
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to remove item",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshCart();
      toast({
        title: "Cart refreshed",
        description: "Your cart has been updated"
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to refresh cart",
        variant: "destructive"
      });
    }
  };

  const total = useMemo(() => {
    return cart?.reduce((sum, i) => sum + i.priceSnapshot * i.quantity, 0) || 0;
  }, [cart]);

  const getCartItemCount = () => {
    return cart?.reduce((s, i) => s + i.quantity, 0) || 0;
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

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed right-0 top-0 h-full w-full sm:w-80 md:w-96 lg:w-[28rem] bg-white shadow-2xl flex flex-col z-50"
            role="dialog"
            aria-label="Shopping Cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-beige">
                <ShoppingCart className="w-7 h-7" />
                Your Cart
                {cart?.length ? (
                  <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                    {getCartItemCount()}
                  </Badge>
                ) : null}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="text-beige hover:text-muddy-brown hover:bg-gray-200 transition-colors"
                  aria-label="Refresh cart"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-beige hover:text-muddy-brown hover:bg-gray-200 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-6">
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="flex justify-between items-center text-sm text-beige">
                    {typeof error === 'string' ? error : 'Something went wrong'}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRefresh}
                      className="text-beige hover:text-muddy-brown border-beige hover:bg-gray-200"
                    >
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" role="list">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <RefreshCw className="w-10 h-10 animate-spin text-beige mb-4" />
                  <p className="text-beige text-lg font-medium">Loading cart...</p>
                </div>
              ) : !cart?.length ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="w-24 h-24 text-beige/50 mb-4" />
                  <h3 className="text-xl font-semibold text-beige">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-gray-400 mt-2 max-w-xs">
                    Browse our products and add some items to get started!
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {cart.map((item) => (
                    <CartItemCard
                      key={item.productId}
                      item={item}
                      isLoading={isLoading}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart?.length ? (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between items-center text-xl font-bold text-beige mb-4">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Button
                  className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-beige hover:text-muddy-brown transition-all duration-300 rounded-lg"
                  aria-label="Proceed to checkout"
                  onClick={() => { onClose(); navigate('/checkout'); }}
                  disabled={isLoading}
                >
                  Proceed to Checkout
                </Button>
              </div>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;