// src/context/DrawerContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface DrawerContextType {
  cartOpen: boolean;
  wishlistOpen: boolean;
  openCart: () => void;
  openWishlist: () => void;
  closeCart: () => void;
  closeWishlist: () => void;
}

const DrawerContext = createContext<DrawerContextType | null>(null);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <DrawerContext.Provider
      value={{
        cartOpen,
        wishlistOpen,
        openCart: () => setCartOpen(true),
        openWishlist: () => setWishlistOpen(true),
        closeCart: () => setCartOpen(false),
        closeWishlist: () => setWishlistOpen(false),
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('useDrawer must be used within DrawerProvider');
  return context;
};
