import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  Bell,
  Plus,
  ArrowUpRight,
  Clock
} from 'lucide-react';

const metrics = [
  {
    title: 'Total Revenue',
    value: '$12,543',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Active Orders',
    value: '24',
    change: '+3 new',
    trend: 'up',
    icon: Package,
  },
  {
    title: 'Total Customers',
    value: '1,247',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    change: '+0.5%',
    trend: 'up',
    icon: TrendingUp,
  },
];

const recentOrders = [
  { id: '#3421', customer: 'Sarah Johnson', service: 'Express Delivery', amount: '$45.00', status: 'Processing' },
  { id: '#3420', customer: 'Mike Chen', service: 'Standard Delivery', amount: '$25.00', status: 'Completed' },
  { id: '#3419', customer: 'Lisa Wong', service: 'Premium Package', amount: '$89.00', status: 'Shipped' },
  { id: '#3418', customer: 'Tom Wilson', service: 'Express Delivery', amount: '$52.00', status: 'Processing' },
];

const upcomingTasks = [
  { task: 'Process pending orders', time: '2 hours', urgent: true },
  { task: 'Update delivery schedules', time: '4 hours', urgent: false },
  { task: 'Customer follow-up calls', time: '6 hours', urgent: false },
  { task: 'Inventory restocking', time: '1 day', urgent: true },
];

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-success flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest customer orders and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.id} • {order.service}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">{order.amount}</p>
                    <Badge 
                      variant={order.status === 'Completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Your pending activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border border-border rounded-lg"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${task.urgent ? 'bg-warning' : 'bg-success'}`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{task.task}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due in {task.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Your business metrics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-gradient-card rounded-lg">
              <div className="text-2xl font-bold text-primary">94%</div>
              <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
            </div>
            <div className="text-center p-4 bg-gradient-card rounded-lg">
              <div className="text-2xl font-bold text-success">4.8</div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            <div className="text-center p-4 bg-gradient-card rounded-lg">
              <div className="text-2xl font-bold text-accent">156</div>
              <p className="text-sm text-muted-foreground">Orders This Month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}