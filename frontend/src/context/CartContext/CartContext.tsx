import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/api/api';

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
  error: string | null;
  refreshCart: () => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL as string;

  // Load cart from backend on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      setCart([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getCart();
      setCart((data as any)?.items || []);
    } catch (error: any) {
      console.error('Failed to load cart:', error);
      setError(error.message || 'Failed to load cart');
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.addToCart(productId, quantity);
      setCart((data as any)?.cart?.items || []);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      setError(error.message || 'Failed to add item to cart');
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
      setError(null);
      const data = quantity < 1
        ? await apiService.removeCartItem(productId)
        : await apiService.updateCartItem(productId, quantity);
      setCart((data as any)?.cart?.items || []);
    } catch (error: any) {
      console.error('Failed to update cart:', error);
      setError(error.message || 'Failed to update cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      throw new Error('Please login to update cart');
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.removeCartItem(productId);
      setCart((data as any)?.cart?.items || []);
    } catch (error: any) {
      console.error('Failed to update cart:', error);
      setError(error.message || 'Failed to update cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      throw new Error('Please login to clear cart');
    }

    try {
      setIsLoading(true);
      setError(null);
      await apiService.clearCart();
      setCart([]);
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      setError(error.message || 'Failed to clear cart');
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
    isLoading,
    error,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
