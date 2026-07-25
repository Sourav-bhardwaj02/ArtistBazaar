import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye,
  ShoppingCart,
  DollarSign,
  Calendar,
  Download
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth/AuthContext";
import { apiService } from "@/api/api";

interface AnalyticsData {
  totalViews: number;
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
  topProducts: any[];
  monthlyData: any[];
  recentActivity: any[];
}

export default function ServiceAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalSales: 0,
    totalRevenue: 0,
    conversionRate: 0,
    topProducts: [],
    monthlyData: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Fetch Services all products for analytics
        const productsData: any = await apiService.getServiceProducts();
        const products = productsData.products || [];
        
        // Calculate analytics
        const totalViews = products.reduce((sum: number, product: any) => sum + (product.views || 0), 0);
        const totalSales = products.reduce((sum: number, product: any) => sum + (product.sold || 0), 0);
        const totalRevenue = products.reduce((sum: number, product: any) => sum + (product.price * (product.sold || 0)), 0);
        const conversionRate = totalViews > 0 ? (totalSales / totalViews) * 100 : 0;
        
        // Top performing products
        const topProducts = products
          .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
          .slice(0, 5);
        
        // Mock monthly data
        const monthlyData = [
          { month: "Jan", views: 1200, sales: 45, revenue: 2250 },
          { month: "Feb", views: 1500, sales: 52, revenue: 2600 },
          { month: "Mar", views: 1800, sales: 68, revenue: 3400 },
          { month: "Apr", views: 2100, sales: 75, revenue: 3750 },
          { month: "May", views: 1900, sales: 62, revenue: 3100 },
          { month: "Jun", views: 2300, sales: 85, revenue: 4250 }
        ];
        
        // Recent activity
        const recentActivity = [
          { action: "Product viewed", product: "Handmade Pottery", time: "2 min ago", type: "view" },
          { action: "Order received", product: "Wooden Sculpture", time: "15 min ago", type: "sale" },
          { action: "Product updated", product: "Textile Art", time: "1 hour ago", type: "update" },
          { action: "New product added", product: "Ceramic Vase", time: "2 hours ago", type: "add" }
        ];

        setAnalytics({
          totalViews,
          totalSales,
          totalRevenue,
          conversionRate,
          topProducts,
          monthlyData,
          recentActivity
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const metricsData = [
    {
      title: "Total Views",
      value: analytics.totalViews.toLocaleString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Eye,
      description: "Product page views",
    },
    {
      title: "Total Sales",
      value: analytics.totalSales.toString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      description: "Items sold",
    },
    {
      title: "Total Revenue",
      value: `$${analytics.totalRevenue.toFixed(2)}`,
      change: "+15%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Total earnings",
    },
    {
      title: "Conversion Rate",
      value: `${analytics.conversionRate.toFixed(1)}%`,
      change: "+2.3%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Views to sales",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading analytics...</p>
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
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your sales performance and product insights.
          </p>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric) => (
          <Card key={metric.title} className="shadow-card hover:shadow-elegant transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-2 text-xs">
                <Badge 
                  variant={metric.changeType === "positive" ? "default" : "destructive"}
                  className={metric.changeType === "positive" ? "bg-success text-success-foreground" : ""}
                >
                  {metric.change}
                </Badge>
                <span className="text-muted-foreground">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Performance
            </CardTitle>
            <CardDescription>Views, sales, and revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyData.map((data, index) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{data.month}</span>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{data.views} views</span>
                      <span>{data.sales} sales</span>
                      <span>${data.revenue}</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.views / 2500) * 100}%` }}
                    />
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
              Top Performing Products
            </CardTitle>
            <CardDescription>Your best-selling products by views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
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
                  <div className="text-right">
                    <p className="font-medium">${product.price}</p>
                    <p className="text-sm text-muted-foreground">{product.sold || 0} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest actions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === "sale" ? "bg-green-500" :
                    activity.type === "view" ? "bg-blue-500" :
                    activity.type === "update" ? "bg-yellow-500" : "bg-purple-500"
                  }`} />
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.product}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
