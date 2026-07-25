import { useState, useEffect, useCallback } from "react";
import { MetricsCard } from "@/components/MetricsCard";
import { AddProductDialog } from "@/components/AddProductDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/auth/AuthContext";
import { apiService } from "@/api/api";
import {
  DollarSign,
  Package,
  Users,
  TrendingUp,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

// Define types for API responses
interface Sale {
  _id: string;
  product: string;
  customer: string;
  status: "paid" | "shipped" | "pending";
  amount: number;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  sales: number;
  revenue: number;
  stock: number;
  status: string;
  createdAt: string;
}

interface SellerStats {
  totalRevenue: number;
  totalProducts: number;
  totalSales: number;
  conversionRate: number;
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<SellerStats>({
    totalRevenue: 0,
    totalProducts: 0,
    totalSales: 0,
    conversionRate: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch seller products
      const productsData = await apiService.getSellerProducts() as any;
      setProducts(productsData.items || []);

      // Calculate stats from products
      const totalRevenue = productsData.items?.reduce((sum: number, product: Product) => sum + (product.revenue || 0), 0) || 0;
      const totalSales = productsData.items?.reduce((sum: number, product: Product) => sum + (product.sales || 0), 0) || 0;
      const totalProducts = productsData.items?.length || 0;
      const conversionRate = totalProducts > 0 ? (totalSales / totalProducts) * 100 : 0;

      setStats({
        totalRevenue,
        totalProducts,
        totalSales,
        conversionRate
      });

      // Set top products (products with highest sales)
      const sortedProducts = (productsData.items || [])
        .sort((a: Product, b: Product) => (b.sales || 0) - (a.sales || 0))
        .slice(0, 5);
      setTopProducts(sortedProducts);

      // Mock recent sales data (you can implement this in backend)
      setRecentSales([
        {
          _id: "1",
          product: "Hand-Painted Vase",
          customer: "John Doe",
          status: "paid",
          amount: 1200,
          createdAt: new Date().toISOString()
        },
        {
          _id: "2", 
          product: "Silver Earrings",
          customer: "Jane Smith",
          status: "shipped",
          amount: 2500,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);

      setError(null);
    } catch (error: any) {
      console.error("Fetch error:", error);
      setError(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Track your sales performance and manage your business.</p>
        </div>
        {/* <Button
  type="button"
  variant="outline"
  className="h-20 flex-col"
  onClick={() => setAddProductOpen(true)}
>
  <Plus className="h-6 w-6 mb-2" />
  Add Product
</Button> */}
<Button onClick={() => setAddProductOpen(true)}>
  <Plus className="w-4 h-4 mr-2" />
  Add Product
</Button>


      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/90 text-destructive-foreground p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          description="Total earnings from sales"
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
        />
        <MetricsCard
          title="Products Sold"
          value={stats.totalSales.toString()}
          description="Total units sold"
          icon={Package}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricsCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          description="Products in your catalog"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricsCard
          title="Conversion Rate"
          value={`${stats.conversionRate.toFixed(1)}%`}
          description="Sales per product ratio"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Your latest transactions and orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div key={sale._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{sale.product}</p>
                    <p className="text-xs text-muted-foreground">{sale.customer} • {sale._id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        sale.status === "paid"
                          ? "default"
                          : sale.status === "shipped"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        sale.status === "paid"
                          ? "bg-success text-success-foreground"
                          : sale.status === "shipped"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      {sale.status === "paid" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {sale.status === "shipped" && <Clock className="w-3 h-3 mr-1" />}
                      {sale.status === "pending" && <AlertCircle className="w-3 h-3 mr-1" />}
                      {sale.status}
                    </Badge>
                    <span className="font-semibold text-sm">₹{sale.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center">No recent sales available.</p>
            )}
            <Button variant="outline" className="w-full mt-4">
              <Eye className="mr-2 h-4 w-4" />
              View All Sales
            </Button>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Your best performing product lines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-glow rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">₹{product.revenue.toLocaleString()}</p>
                      <p className="text-xs text-success">{product.sales} sales</p>
                    </div>
                  </div>
                  <Progress value={Math.min((product.sales / Math.max(...topProducts.map(p => p.sales))) * 100, 100)} className="h-1" />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center">No top products available.</p>
            )}
            <Button variant="outline" className="w-full mt-4" onClick={() => {
              const sellerId = localStorage.getItem('sellerId') || '';
              if (sellerId) window.location.href = `/seller/${sellerId}/products`;
            }}>
              <Package className="mr-2 h-4 w-4" />
              Manage Products
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your business efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col" onClick={() => setAddProductOpen(true)}>
              <Plus className="h-6 w-6 mb-2" />
              Add Product
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              View Customers
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Sales Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Package className="h-6 w-6 mb-2" />
              Inventory
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddProductDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        onSuccess={() => fetchData()}
      />
    </div>
  );
}