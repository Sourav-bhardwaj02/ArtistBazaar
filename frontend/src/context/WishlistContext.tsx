import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (productId: string, product?: WishlistItem['product']) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
  clearWishlist: () => void;
  isLoading: boolean;
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

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        // Convert date strings back to Date objects
        const wishlistWithDates = parsedWishlist.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        setWishlist(wishlistWithDates);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        setWishlist([]);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = async (productId: string, product?: WishlistItem['product']) => {
    setIsLoading(true);
    try {
      // Check if already in wishlist
      if (isInWishlist(productId)) {
        throw new Error('Product is already in your wishlist');
      }

      const newItem: WishlistItem = {
        productId,
        product,
        addedAt: new Date()
      };

      setWishlist(prev => [...prev, newItem]);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setIsLoading(true);
    try {
      setWishlist(prev => prev.filter(item => item.productId !== productId));
    } catch (error) {
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
    isLoading
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
