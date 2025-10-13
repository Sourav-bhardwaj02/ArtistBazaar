import React, { createContext, useContext, useEffect } from 'react';
import { Product, Seller, DashboardStats } from '@/types/seller';
import { mockProducts, mockSeller, mockStats } from '@/data/mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SellerContextType {
  seller: Seller | null;
  products: Product[];
  stats: DashboardStats;
  isAuthenticated: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateSeller: (updates: Partial<Seller>) => void;
}

const SellerContext = createContext<SellerContextType | undefined>(undefined);

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const [seller, setSeller] = useLocalStorage<Seller | null>('seller', null);
  const [products, setProducts] = useLocalStorage<Product[]>('sellerProducts', []);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('isAuthenticated', false);

  const calculateStats = (products: Product[]): DashboardStats => {
    const activeProducts = products.filter(p => p.status === 'active').length;
    const inactiveProducts = products.filter(p => p.status === 'inactive').length;
    const lowStockProducts = products.filter(p => p.stock <= 10 && p.status === 'active').length;
    
    return {
      totalProducts: products.length,
      activeProducts,
      inactiveProducts,
      lowStockProducts,
      totalOrders: mockStats.totalOrders,
      monthlyRevenue: mockStats.monthlyRevenue,
      avgRating: mockStats.avgRating,
    };
  };

  const stats = calculateStats(products);

  // Initialize with mock data if empty
  useEffect(() => {
    if (products.length === 0 && isAuthenticated) {
      setProducts(mockProducts);
    }
    if (!seller && isAuthenticated) {
      setSeller(mockSeller);
    }
  }, [isAuthenticated, products.length, seller, setProducts, setSeller]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const toggleProductStatus = (id: string) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { 
            ...product, 
            status: product.status === 'active' ? 'inactive' : 'active',
            updatedAt: new Date().toISOString()
          }
        : product
    ));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    if (email && password) {
      setIsAuthenticated(true);
      setSeller(mockSeller);
      setProducts(mockProducts);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setSeller(null);
    setProducts([]);
  };

  const updateSeller = (updates: Partial<Seller>) => {
    if (seller) {
      setSeller({ ...seller, ...updates });
    }
  };

  return (
    <SellerContext.Provider value={{
      seller,
      products,
      stats,
      isAuthenticated,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleProductStatus,
      login,
      logout,
      updateSeller,
    }}>
      {children}
    </SellerContext.Provider>
  );
}

export function useSeller() {
  const context = useContext(SellerContext);
  if (context === undefined) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
}
