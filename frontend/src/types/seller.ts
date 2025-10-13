export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  tags: string[];
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
    pickupAvailable: boolean;
    deliveryAvailable: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Seller {
  id: string;
  email: string;
  phone: string;
  storeName: string;
  contactInfo: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  logo?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  monthlyRevenue: number;
  avgRating: number;
}