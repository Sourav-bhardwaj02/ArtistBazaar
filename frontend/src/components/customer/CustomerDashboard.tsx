import { MetricsCard } from "@/components/MetricsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth/AuthContext";
import { useCart } from "@/context/CartContext/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { 
  ShoppingCart, Package, Building2, TrendingUp, Plus, Eye, 
  Clock, CheckCircle, AlertCircle, Users, BarChart3, Settings 
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>(); // ✅ Customer ID from route
  const { getCartItemCount, getCartTotal } = useCart();
  const { getWishlistCount } = useWishlist();
  const [unreadChats, setUnreadChats] = useState(3); // Mock data

  // ✅ CUSTOMER-SPECIFIC mock data (not seller data)
  const recentOrders = [
    { id: "ORD-001", product: "Hand-Painted Vase", supplier: "Priya Sharma", status: "delivered", amount: "₹1,200" },
    { id: "ORD-002", product: "Silver Earrings", supplier: "Anita Desai", status: "pending", amount: "₹2,500" },
    { id: "ORD-003", product: "Cotton Saree", supplier: "Lakshmi Nair", status: "shipped", amount: "₹3,500" },
  ];

  const topSuppliers = [
    { name: "Priya Sharma", orders: 24, rating: 4.8, location: "Jaipur" },
    { name: "Anita Desai", orders: 18, rating: 4.6, location: "Mumbai" },
    { name: "Lakshmi Nair", orders: 12, rating: 4.9, location: "Varanasi" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* ✅ CUSTOMER Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Your shopping overview and favorite artisans (ID: {id})</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
          <Plus className="mr-2 h-4 w-4" />
          Browse Products
        </Button>
      </div>

      {/* ✅ CUSTOMER Metrics (Shopping-focused) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Cart Items"
          value={getCartItemCount().toString()}
          description="Items in your cart"
          icon={ShoppingCart}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricsCard
          title="Wishlist"
          value={getWishlistCount().toString()}
          description="Saved for later"
          icon={Package}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricsCard
          title="Favorite Artisans"
          value="12"
          description="Artisans you follow"
          icon={Building2}
          trend={{ value: 5, isPositive: true }}
        />
        <MetricsCard
          title="Cart Total"
          value={`₹${getCartTotal().toLocaleString()}`}
          description="Current cart value"
          icon={TrendingUp}
          trend={{ value: 18, isPositive: true }}
        />
      </div>

      {/* ✅ CUSTOMER Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>Your latest purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{order.product}</p>
                    <p className="text-xs text-muted-foreground">{order.supplier} • {order.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={
                        order.status === 'delivered' ? 'default' : 
                        order.status === 'shipped' ? 'secondary' : 'outline'
                      }
                    >
                      {order.status}
                    </Badge>
                    <span className="font-semibold text-sm">{order.amount}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" asChild className="w-full mt-4">
                <Link to={`/customer/${id}/orders`}>View All Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ✅ CUSTOMER Top Artisans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Artisans
            </CardTitle>
            <CardDescription>Your most trusted suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSuppliers.map((supplier, index) => (
                <div key={supplier.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-glow rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{supplier.name}</p>
                      <p className="text-xs text-muted-foreground">{supplier.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{supplier.orders} orders</p>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-warning">★</span>
                      <span className="text-xs">{supplier.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" asChild className="w-full mt-4">
                <Link to={`/customer/${id}/suppliers`}>View All Artisans</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ CUSTOMER Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your shopping experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Link to={`/customer/${id}/products`}>
                <Package className="w-8 h-8 mb-2" />
                <span className="font-medium text-sm">Browse Products</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Link to={`/customer/${id}/orders`}>
                <ShoppingCart className="w-8 h-8 mb-2" />
                <span className="font-medium text-sm">Track Orders</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Link to={`/customer/${id}/wishlist`}>
                <Eye className="w-8 h-8 mb-2" />
                <span className="font-medium text-sm">Wishlist</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto relative">
              <Link to={`/customer/${id}/suppliers`}>
                <Users className="w-8 h-8 mb-2" />
                <span className="font-medium text-sm">Suppliers</span>
                {unreadChats > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadChats}
                  </span>
                )}
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Link to={`/customer/${id}/analytics`}>
                <BarChart3 className="w-8 h-8 mb-2" />
                <span className="font-medium text-sm">Analytics</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Link to={`/customer/${id}/settings`}>
                <Settings className="w-8 h-8 mb-2" />
                <span className="font-medium text-sm">Settings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
