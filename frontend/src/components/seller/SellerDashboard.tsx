import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Eye,
  Edit,
  Plus,
  BarChart3,
  Settings,
  User
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth/AuthContext";
import { apiService } from "@/api/api";
import { Link } from "react-router-dom";
import { AddProductDialog } from "@/components/AddProductDialog";

interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalViews: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalViews: 0,
    recentOrders: [],
    topProducts: []
  });
  const [addProductOpen, setAddProductOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [unreadChats, setUnreadChats] = useState(0);

  const fetchSellerData = useCallback(async () => {
      try {
        setLoading(true);
        // Fetch seller's products
        const productsData = await apiService.getSellerProducts() as any;
        const products = productsData.items || [];
        
        // Calculate stats
        const totalProducts = products.length;
        const totalViews = products.reduce((sum: number, product: any) => sum + (product.views || 0), 0);
        const totalRevenue = products.reduce((sum: number, product: any) => sum + (product.price * (product.sold || 0)), 0);
        
        // Mock data for orders (replace with actual API call)
        const recentOrders = [
          { id: "1", customer: "John Doe", product: "Handmade Pottery", amount: 45.99, status: "completed", date: "2024-01-15" },
          { id: "2", customer: "Jane Smith", product: "Wooden Sculpture", amount: 89.99, status: "pending", date: "2024-01-14" },
          { id: "3", customer: "Bob Johnson", product: "Textile Art", amount: 34.50, status: "shipped", date: "2024-01-13" }
        ];
        
        const topProducts = products
          .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
          .slice(0, 5);

        setStats({
          totalProducts,
          totalOrders: recentOrders.length,
          totalRevenue,
          totalViews,
          recentOrders,
          topProducts
        });
      } catch (error) {
        console.error("Error fetching seller data:", error);
      } finally {
        setLoading(false);
      }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSellerData();
      // Load unread chats count
      (async () => {
        try {
          const res: any = await apiService.getConversations();
          const meId = user?.id || (user as any)?._id;
          const count = (res?.conversations || []).reduce((acc: number, c: any) => acc + (c.unread || 0), 0);
          setUnreadChats(count);
        } catch {}
      })();
    }
  }, [user, fetchSellerData]);

  const statsData = [
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      change: "+2",
      changeType: "positive" as const,
      icon: Package,
      description: "Products listed",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      description: "Orders received",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      change: "+8%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Total earnings",
    },
    {
      title: "Product Views",
      value: stats.totalViews.toString(),
      change: "+23%",
      changeType: "positive" as const,
      icon: Eye,
      description: "Total views",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's your seller dashboard overview.
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button asChild>
            <Link to={`/seller/${user?.id}/products/new`}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button> */}
          <Button onClick={() => setAddProductOpen(true)}>
  <Plus /> Add Product
</Button>

          <Button variant="outline" asChild>
            <Link to={`/seller/${user?.id}/analytics`}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <Card key={stat.title} className="shadow-card hover:shadow-elegant transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 text-xs">
                <Badge 
                  variant={stat.changeType === "positive" ? "default" : "destructive"}
                  className={stat.changeType === "positive" ? "bg-success text-success-foreground" : ""}
                >
                  {stat.change}
                </Badge>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>Latest orders from customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.amount}</p>
                    <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Products
            </CardTitle>
            <CardDescription>Your most viewed products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={product._id || index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.views || 0} views</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used seller tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild className="flex flex-col items-center p-4 h-auto">
              <Link to={`/seller/${user?.id}/products`}>
                <Package className="w-8 h-8 mb-2" />
                <span className="font-medium">Manage Products</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Link to={`/seller/${user?.id}/orders`}>
                <ShoppingCart className="w-8 h-8 mb-2" />
                <span className="font-medium">View Orders</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Link to={`/seller/${user?.id}/analytics`}>
                <BarChart3 className="w-8 h-8 mb-2" />
                <span className="font-medium">Analytics</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto relative">
              <Link to={`/seller/${user?.id}/chats`}>
                <Users className="w-8 h-8 mb-2" />
                <span className="font-medium">Chats</span>
                {unreadChats > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadChats}
                  </span>
                )}
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Link to={`/seller/${user?.id}/settings`}>
                <Settings className="w-8 h-8 mb-2" />
                <span className="font-medium">Settings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <AddProductDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        onSuccess={() => fetchSellerData()}
      />
    </div>
  );
}
