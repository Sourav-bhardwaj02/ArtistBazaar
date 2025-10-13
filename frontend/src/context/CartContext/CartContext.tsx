import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  productId: string;
  quantity: number;
  priceSnapshot: number;
  product?: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_URL as string;

  // Load cart from backend on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/cart`, {
        headers: { 'auth-token': token }
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data.items || []);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ productId, quantity })
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart.items || []);
      } else {
        throw new Error(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      throw new Error('Please login to update cart');
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/cart/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ productId, quantity })
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart.items || []);
      } else {
        throw new Error(data.message || 'Failed to update cart');
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    await updateCartQuantity(productId, 0);
  };

  const clearCart = async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      throw new Error('Please login to clear cart');
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/cart/clear`, {
        method: 'POST',
        headers: { 'auth-token': token }
      });

      const data = await response.json();
      if (response.ok) {
        setCart([]);
      } else {
        throw new Error(data.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.priceSnapshot * item.quantity), 0);
  };

  const value: CartContextType = {
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
