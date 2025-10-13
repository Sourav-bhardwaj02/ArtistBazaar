import { Layout } from "@/components/PanelLout/Layout";
import { MetricsCard } from "@/components/MetricsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ShoppingCart,
  Package,
  Building2,
  TrendingUp,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function CustomerDashboard() {
  const recentOrders = [
    { id: "ORD-001", product: "Industrial Pumps", supplier: "TechFlow Ltd", status: "delivered", amount: "₹12,500" },
    { id: "ORD-002", product: "Steel Components", supplier: "MetalWorks Inc", status: "pending", amount: "₹8,750" },
    { id: "ORD-003", product: "Electronics Parts", supplier: "CircuitMax", status: "shipped", amount: "₹3,200" },
  ];

  const topSuppliers = [
    { name: "TechFlow Ltd", orders: 24, rating: 4.8, location: "Germany" },
    { name: "MetalWorks Inc", orders: 18, rating: 4.6, location: "USA" },
    { name: "CircuitMax", orders: 12, rating: 4.9, location: "Japan" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your procurement overview.</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
            <Plus className="mr-2 h-4 w-4" />
            New RFQ
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Total Orders"
            value="142"
            description="Active procurement orders"
            icon={ShoppingCart}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricsCard
            title="Products Sourced"
            value="1,247"
            description="Unique products sourced"
            icon={Package}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricsCard
            title="Active Suppliers"
            value="89"
            description="Trusted supplier partners"
            icon={Building2}
            trend={{ value: 5, isPositive: true }}
          />
          <MetricsCard
            title="Cost Savings"
            value="₹24.5K"
            description="This quarter savings"
            icon={TrendingUp}
            trend={{ value: 18, isPositive: true }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest procurement activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                        order.status === 'shipped' ? 'secondary' : 
                        'outline'
                      }
                      className={
                        order.status === 'delivered' ? 'bg-success text-success-foreground' :
                        order.status === 'shipped' ? 'bg-primary text-primary-foreground' :
                        ''
                      }
                    >
                      {order.status === 'delivered' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {order.status === 'shipped' && <Clock className="w-3 h-3 mr-1" />}
                      {order.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {order.status}
                    </Badge>
                    <span className="font-semibold text-sm">{order.amount}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                <Eye className="mr-2 h-4 w-4" />
                View All Orders
              </Button>
            </CardContent>
          </Card>

          {/* Top Suppliers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Suppliers</CardTitle>
              <CardDescription>Your most reliable supplier partners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <Button variant="outline" className="w-full mt-4">
                <Building2 className="mr-2 h-4 w-4" />
                View All Suppliers
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Streamline your procurement workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Button variant="outline" className="h-20 flex-col">
                <Package className="h-6 w-6 mb-2" />
                Browse Products
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => window.location.href = '/Customer/suppliers'}
              >
                <Building2 className="h-6 w-6 mb-2" />
                Find Suppliers
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Plus className="h-6 w-6 mb-2" />
                Create RFQ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}