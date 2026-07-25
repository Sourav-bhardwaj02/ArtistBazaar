import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart, DollarSign, TrendingUp, Activity, Shield, FileText, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth/AuthContext";
import { apiService } from "@/api/api";

interface AdminStats {
  totalSellers: number;
  totalServices: number;
  totalProducts: number;
  totalCustomers: number;
}

const recentActivity = [
  { action: "New user registered", user: "john@example.com", time: "5 min ago", type: "user" },
  { action: "Order completed", user: "Order #12543", time: "12 min ago", type: "order" },
  { action: "Security scan completed", user: "System", time: "1 hour ago", type: "security" },
  { action: "Database backup", user: "System", time: "2 hours ago", type: "system" },
];

const systemStatus = [
  { name: "API Server", status: "healthy", uptime: "99.9%" },
  { name: "Database", status: "healthy", uptime: "99.8%" },
  { name: "Payment Gateway", status: "healthy", uptime: "99.7%" },
  { name: "Security System", status: "warning", uptime: "98.2%" },
];

export default function Overview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalSellers: 0,
    totalServices: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const overviewData = await apiService.getAdminOverview();
        setStats(overviewData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const statsData = [
    {
      title: "Total Sellers",
      value: (stats.totalSellers || 0).toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      description: "Active sellers on platform",
    },
    {
      title: "Total Services",
      value: (stats.totalServices || 0).toString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      description: "Service providers",
    },
    {
      title: "Total Products",
      value: (stats.totalProducts || 0).toString(),
      change: "+23%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Products listed",
    },
    {
      title: "Total Customers",
      value: (stats.totalCustomers || 0).toString(),
      change: "+2.3%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Registered customers",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your platform today.
        </p>
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
        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system activities and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Status
            </CardTitle>
            <CardDescription>Current health status of all systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((system, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      system.status === "healthy" ? "bg-success" : 
                      system.status === "warning" ? "bg-warning" : "bg-destructive"
                    }`} />
                    <span className="font-medium">{system.name}</span>
                  </div>
                  <div className="text-right">
                    <Badge variant={system.status === "healthy" ? "default" : "secondary"}>
                      {system.uptime}
                    </Badge>
                  </div>
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
          <CardDescription>Frequently used administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-primary text-white hover:shadow-glow transition-shadow cursor-pointer">
              <Users className="w-8 h-8 mb-2" />
              <span className="font-medium">Manage Users</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-subtle border hover:shadow-card transition-shadow cursor-pointer">
              <Database className="w-8 h-8 mb-2" />
              <span className="font-medium">View Data</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-subtle border hover:shadow-card transition-shadow cursor-pointer">
              <Shield className="w-8 h-8 mb-2" />
              <span className="font-medium">Security Scan</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-subtle border hover:shadow-card transition-shadow cursor-pointer">
              <FileText className="w-8 h-8 mb-2" />
              <span className="font-medium">View Logs</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}