import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/api/api';

interface WishlistItem {
  productId: string;
  product?: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    category?: string;
  };
  addedAt: Date;
}

interface ApiWishlistProduct {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
}

interface ApiWishlistResponseItem {
  product: ApiWishlistProduct | null;
  createdAt: string;
}

interface ApiWishlistResponse {
  items: ApiWishlistResponseItem[];
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (productId: string, product?: WishlistItem['product']) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
  clearWishlist: () => void;
  isLoading: boolean;
  error: string | null;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load wishlist from backend on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getWishlist();
      const wishlistItems = (data.items ?? [])
        .map((item: ApiWishlistResponseItem) => {
          if (!item?.product?._id) return null;
          return {
            productId: item.product._id,
            product: item.product,
            addedAt: new Date(item.createdAt),
          } as WishlistItem;
        })
        .filter((x): x is WishlistItem => x !== null);
      setWishlist(wishlistItems);
    } catch (error: any) {
      console.error('Failed to load wishlist:', error);
      setError(error.message || 'Failed to load wishlist');
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWishlist = async () => {
    await loadWishlist();
  };

  const addToWishlist = async (productId: string, product?: WishlistItem['product']) => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      throw new Error('Please login to add items to wishlist');
    }

    setIsLoading(true);
    try {
      setError(null);
      const data = await apiService.addToWishlist(productId);
      const newItem: WishlistItem = {
        productId,
        product: product || data.item.product,
        addedAt: new Date()
      };
      setWishlist(prev => [...prev, newItem]);
    } catch (error: any) {
      setError(error.message || 'Failed to add item to wishlist');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      throw new Error('Please login to remove items from wishlist');
    }

    setIsLoading(true);
    try {
      setError(null);
      await apiService.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(item => item.productId !== productId));
    } catch (error: any) {
      setError(error.message || 'Failed to remove item from wishlist');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item.productId === productId);
  };

  const getWishlistCount = (): number => {
    return wishlist.length;
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
    isLoading,
    error,
    refreshWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
