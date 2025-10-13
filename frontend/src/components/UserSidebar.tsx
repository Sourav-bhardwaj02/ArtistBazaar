import React, { useState, useEffect } from 'react';
import { X, User, ShoppingCart, Heart, Package, Settings, LogOut, Bell, CreditCard, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useNavigate } from 'react-router-dom';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name?: string;
    role?: string;
    email?: string;
  } | null;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();
  const { cart, getCartItemCount, getCartTotal } = useCart();
  const { wishlist, getWishlistCount } = useWishlist();
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    // Load recent products from localStorage
    const saved = localStorage.getItem('recentProducts');
    if (saved) {
      try {
        setRecentProducts(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent products:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('refresh-token');
    localStorage.removeItem('auth-role');
    localStorage.removeItem('user-data');
    onClose();
    navigate('/');
    window.location.reload();
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800';
      case 'Seller':
        return 'bg-blue-100 text-blue-800';
      case 'Services':
        return 'bg-green-100 text-green-800';
      case 'Customer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'Admin':
        return '👑';
      case 'Seller':
        return '🎨';
      case 'Services':
        return '🛠️';
      case 'Customer':
        return '🛍️';
      default:
        return '👤';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-amber-500 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold">{user?.name || 'User'}</h2>
                <p className="text-sm opacity-90">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{getRoleIcon(user?.role)}</span>
              <Badge className={getRoleColor(user?.role)}>
                {user?.role || 'User'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              Welcome back! Here's your account overview.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Cart</span>
                </div>
                <p className="text-lg font-bold text-blue-600">{getCartItemCount()}</p>
                <p className="text-xs text-gray-600">₹{getCartTotal().toFixed(2)}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">Wishlist</span>
                </div>
                <p className="text-lg font-bold text-red-600">{getWishlistCount()}</p>
                <p className="text-xs text-gray-600">Saved items</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/products');
                  onClose();
                }}
              >
                <Package className="w-4 h-4 mr-3" />
                Browse Products
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/chat');
                  onClose();
                }}
              >
                <Bell className="w-4 h-4 mr-3" />
                AI Assistant
              </Button>

              {user?.role === 'Seller' && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(`/seller/${user?.email}`);
                    onClose();
                  }}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Manage Products
                </Button>
              )}

              {user?.role === 'Customer' && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/Customer');
                    onClose();
                  }}
                >
                  <CreditCard className="w-4 h-4 mr-3" />
                  My Orders
                </Button>
              )}

              {user?.role === 'Admin' && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/admin');
                    onClose();
                  }}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Admin Panel
                </Button>
              )}
            </div>

            <Separator className="my-4" />

            {/* Recent Products */}
            {recentProducts.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Recent Products</h3>
                <div className="space-y-2">
                  {recentProducts.slice(0, 3).map((product, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                        🏺
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-gray-600">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-4" />

            {/* Wishlist Preview */}
            {wishlist.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Wishlist Items</h3>
                <div className="space-y-2">
                  {wishlist.slice(0, 3).map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                        <Heart className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product?.name || 'Product'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.product?.price ? `₹${item.product.price}` : 'Price not available'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {wishlist.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{wishlist.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
