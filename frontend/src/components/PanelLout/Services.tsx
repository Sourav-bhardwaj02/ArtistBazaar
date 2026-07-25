import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Truck, 
  Package, 
  Clock, 
  Shield, 
  Plus,
  Edit,
  MoreHorizontal,
  Star,
  Users,
  DollarSign,
  Zap
} from 'lucide-react';

const services = [
  {
    id: 1,
    name: 'Express Delivery',
    description: 'Same-day delivery within city limits',
    price: '$25.00',
    duration: '2-4 hours',
    icon: Zap,
    active: true,
    orders: 156,
    rating: 4.9,
    features: ['GPS Tracking', 'Insurance Included', 'Priority Support']
  },
  {
    id: 2,
    name: 'Standard Delivery',
    description: 'Regular delivery service for everyday needs',
    price: '$15.00',
    duration: '1-2 days',
    icon: Truck,
    active: true,
    orders: 324,
    rating: 4.8,
    features: ['GPS Tracking', 'Proof of Delivery', 'Customer Support']
  },
  {
    id: 3,
    name: 'Premium Package',
    description: 'White-glove service with extra care',
    price: '$45.00',
    duration: '3-6 hours',
    icon: Shield,
    active: true,
    orders: 89,
    rating: 5.0,
    features: ['Premium Packaging', 'Signature Required', 'Damage Protection']
  },
  {
    id: 4,
    name: 'Bulk Delivery',
    description: 'Special rates for multiple packages',
    price: '$120.00',
    duration: '1-3 days',
    icon: Package,
    active: false,
    orders: 45,
    rating: 4.7,
    features: ['Volume Discounts', 'Scheduled Pickup', 'Dedicated Agent']
  }
];

export default function Services() {
  const [activeServices, setActiveServices] = useState(
    services.reduce((acc, service) => ({ ...acc, [service.id]: service.active }), {})
  );

  const toggleService = (serviceId: number) => {
    setActiveServices(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage your service offerings and pricing</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Service Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Total Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">614</div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">$25</div>
                <p className="text-xs text-muted-foreground">Avg. Price</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">4.9</div>
                <p className="text-xs text-muted-foreground">Avg. Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <Card key={service.id} className="relative overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-card rounded-lg flex items-center justify-center">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={activeServices[service.id]}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Service Details */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{service.price}</div>
                    <div className="text-xs text-muted-foreground">Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{service.duration}</div>
                    <div className="text-xs text-muted-foreground">Delivery</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-medium">{service.rating}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{service.orders} orders</div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-medium mb-2">Features</h4>
                <div className="flex flex-wrap gap-1">
                  {service.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Service
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`flex-1 ${activeServices[service.id] ? 'text-success border-success' : 'text-muted-foreground'}`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {activeServices[service.id] ? 'Active' : 'Inactive'}
                </Button>
              </div>
            </CardContent>

            {/* Status Indicator */}
            <div 
              className={`absolute top-0 right-0 w-3 h-3 rounded-bl-lg ${
                activeServices[service.id] ? 'bg-success' : 'bg-muted'
              }`} 
            />
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your services efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Bulk Edit Pricing
            </Button>
            <Button variant="outline" size="sm">
              Export Service Data
            </Button>
            <Button variant="outline" size="sm">
              View Analytics
            </Button>
            <Button variant="outline" size="sm">
              Customer Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}