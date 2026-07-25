import { Product, Category, DashboardStats, Seller } from '@/types/seller';

export const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', icon: 'Smartphone', description: 'Phones, laptops, accessories' },
  { id: '2', name: 'Fashion', icon: 'Shirt', description: 'Clothing, shoes, accessories' },
  { id: '3', name: 'Home & Garden', icon: 'Home', description: 'Furniture, decor, tools' },
  { id: '4', name: 'Sports', icon: 'Dumbbell', description: 'Fitness, outdoor, sports gear' },
  { id: '5', name: 'Books', icon: 'Book', description: 'Books, magazines, educational' },
  { id: '6', name: 'Health & Beauty', icon: 'Heart', description: 'Skincare, makeup, wellness' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 99.99,
    originalPrice: 129.99,
    stock: 25,
    category: 'Electronics',
    tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500&h=500&fit=crop'
    ],
    status: 'active',
    location: {
      address: '123 Tech Street, San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194,
      pickupAvailable: true,
      deliveryAvailable: true,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    title: 'Organic Cotton T-Shirt',
    description: 'Comfortable organic cotton t-shirt available in multiple colors and sizes.',
    price: 29.99,
    stock: 0,
    category: 'Fashion',
    tags: ['organic', 'cotton', 'sustainable', 'clothing'],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1503341960582-b45751874cf0?w=500&h=500&fit=crop'
    ],
    status: 'inactive',
    location: {
      address: '456 Fashion Ave, New York, NY',
      pickupAvailable: true,
      deliveryAvailable: false,
    },
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
  },
  {
    id: '3',
    title: 'Smart Home Security Camera',
    description: '1080p HD security camera with night vision, motion detection, and mobile app control.',
    price: 149.99,
    stock: 15,
    category: 'Electronics',
    tags: ['security', 'camera', 'smart home', 'surveillance'],
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'
    ],
    status: 'active',
    location: {
      address: '789 Security Blvd, Austin, TX',
      pickupAvailable: false,
      deliveryAvailable: true,
    },
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-19T09:15:00Z',
  },
  {
    id: '4',
    title: 'Yoga Mat Premium',
    description: 'Non-slip premium yoga mat with carrying strap, perfect for all yoga practices.',
    price: 49.99,
    stock: 8,
    category: 'Sports',
    tags: ['yoga', 'fitness', 'exercise', 'mat'],
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop'
    ],
    status: 'active',
    location: {
      address: '321 Fitness Way, Los Angeles, CA',
      pickupAvailable: true,
      deliveryAvailable: true,
    },
    createdAt: '2024-01-08T16:00:00Z',
    updatedAt: '2024-01-17T11:45:00Z',
  },
];

export const mockSeller: Seller = {
  id: '1',
  email: 'seller@example.com',
  phone: '+1-555-0123',
  storeName: 'Tech & More Store',
  contactInfo: {
    address: '123 Business Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
  },
  logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
  isVerified: true,
  createdAt: '2023-12-01T10:00:00Z',
};

export const mockStats: DashboardStats = {
  totalProducts: 4,
  activeProducts: 3,
  inactiveProducts: 1,
  lowStockProducts: 1,
  totalOrders: 127,
  monthlyRevenue: 4250.75,
  avgRating: 4.8,
};