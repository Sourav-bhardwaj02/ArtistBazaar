import { useState, useEffect } from "react";

import { MetricsCard } from "@/components/MetricsCard";
import { AddProductDialog } from "@/components/AddProductDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Package,
  Users,
  TrendingUp,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
 const recentSales = [
    { id: "INV-001", product: "Industrial Valves", Customer: "BuildTech Corp", status: "paid", amount: "₹15,200" },
    { id: "INV-002", product: "Automation Systems", Customer: "ManufacturingPro", status: "pending", amount: "₹28,500" },
    { id: "INV-003", product: "Safety Equipment", Customer: "SafetyFirst Ltd", status: "shipped", amount: "₹5,800" },
  ];

  const topProducts = [
    { name: "Industrial Valves", sales: 45, revenue: "₹68,400", growth: 15 },
    { name: "Automation Systems", sales: 32, revenue: "₹124,800", growth: 22 },
    { name: "Safety Equipment", sales: 28, revenue: "₹31,200", growth: 8 },
  ];
export default function SellerDashboard() {
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_URL;
        const token = localStorage.getItem('auth-token') || '';
        const res = await fetch(`${API_URL}/api/seller/products`, {
          headers: { 'auth-token': token }
        });
        const json = await res.json();
        if (res.ok) setProducts(json.items || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProducts();
  }, []);
  
 

  return (
    
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
            <p className="text-muted-foreground">Track your sales performance and manage your business.</p>
          </div>
          <Button 
            onClick={() => setAddProductOpen(true)}
            className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Total Revenue"
            value="₹124.7K"
            description="This month's earnings"
            icon={DollarSign}
            trend={{ value: 15, isPositive: true }}
          />
          <MetricsCard
            title="Products Sold"
            value="342"
            description="Units sold this month"
            icon={Package}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricsCard
            title="Active Customers"
            value="156"
            description="Engaged Customer accounts"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricsCard
            title="Conversion Rate"
            value="24.5%"
            description="Quote to sale ratio"
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
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{sale.product}</p>
                    <p className="text-xs text-muted-foreground">{sale.Customer} • {sale.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={
                        sale.status === 'paid' ? 'default' : 
                        sale.status === 'shipped' ? 'secondary' : 
                        'outline'
                      }
                      className={
                        sale.status === 'paid' ? 'bg-success text-success-foreground' :
                        sale.status === 'shipped' ? 'bg-primary text-primary-foreground' :
                        ''
                      }
                    >
                      {sale.status === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {sale.status === 'shipped' && <Clock className="w-3 h-3 mr-1" />}
                      {sale.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {sale.status}
                    </Badge>
                    <span className="font-semibold text-sm">{sale.amount}</span>
                  </div>
                </div>
              ))}
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
              {topProducts.map((product, index) => (
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
                      <p className="text-sm font-semibold">{product.revenue}</p>
                      <p className="text-xs text-success">+{product.growth}%</p>
                    </div>
                  </div>
                  <Progress value={product.growth * 2} className="h-1" />
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
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
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => setAddProductOpen(true)}
              >
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
      />
      </div>
    
  );
}