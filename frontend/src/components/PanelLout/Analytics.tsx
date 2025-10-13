import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const performanceData = [
  { metric: 'Revenue Growth', value: '+23.5%', trend: 'up', period: 'vs last month' },
  { metric: 'Order Volume', value: '+12.8%', trend: 'up', period: 'vs last month' },
  { metric: 'Customer Retention', value: '87.2%', trend: 'up', period: 'this quarter' },
  { metric: 'Avg. Delivery Time', value: '-15min', trend: 'up', period: 'improvement' },
];

const topServices = [
  { name: 'Express Delivery', revenue: '$8,450', orders: 156, growth: '+18%' },
  { name: 'Standard Delivery', revenue: '$6,240', orders: 324, growth: '+12%' },
  { name: 'Premium Package', revenue: '$4,890', orders: 89, growth: '+25%' },
];

export default function Analytics() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your business performance and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceData.map((item) => (
          <Card key={item.metric}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.metric}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.period}</p>
                </div>
                <div className={`p-2 rounded-lg ${item.trend === 'up' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  {item.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-card rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Revenue chart visualization</p>
                <p className="text-sm text-muted-foreground">Interactive charts coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Services</CardTitle>
            <CardDescription>Your most successful offerings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-gradient-card rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{service.revenue}</p>
                    <Badge variant="secondary" className="text-xs">
                      {service.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Customer Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gradient-card rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-8 w-8 text-muted-foreground mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">Pie chart</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">On-time Delivery</span>
                <span className="font-medium">96.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg. Delivery Time</span>
                <span className="font-medium">2.3 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="font-medium">99.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center p-4 bg-gradient-success rounded-lg text-success-foreground">
                <div className="text-2xl font-bold">$12,543</div>
                <p className="text-sm opacity-90">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Best month yet!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}