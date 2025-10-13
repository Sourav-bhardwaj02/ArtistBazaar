import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Award,
  Calendar,
  Users,
  Edit,
  Camera
} from 'lucide-react';

const businessStats = [
  { label: 'Years in Business', value: '5+', icon: Calendar },
  { label: 'Happy Customers', value: '1,200+', icon: Users },
  { label: 'Services Delivered', value: '5,000+', icon: Award },
  { label: 'Average Rating', value: '4.9', icon: Star },
];

const achievements = [
  { title: 'Top Seller 2024', description: 'Awarded for exceptional service quality', date: 'March 2024' },
  { title: '99% Delivery Success', description: 'Maintained perfect delivery record', date: 'February 2024' },
  { title: 'Customer Choice Award', description: 'Recognized by customer reviews', date: 'January 2024' },
];

export default function AboutCustom() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About Us</h1>
          <p className="text-muted-foreground">Manage your business profile and information</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Business Avatar" />
                  <AvatarFallback className="text-lg bg-gradient-primary text-primary-foreground">
                    JS
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">John's Premium Services</CardTitle>
                <CardDescription className="text-base">
                  Your trusted partner for fast and reliable delivery solutions
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">Premium Seller</Badge>
                  <Badge variant="outline">Verified Business</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Description */}
            <div>
              <h3 className="font-semibold mb-2">About Our Business</h3>
              <p className="text-muted-foreground leading-relaxed">
                We are a premium delivery service provider with over 5 years of experience in the industry. 
                Our commitment to excellence and customer satisfaction has made us one of the most trusted 
                names in logistics and delivery services. We pride ourselves on timely deliveries, 
                professional service, and going the extra mile for our customers.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">123 Business St, City, State 12345</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">john@premiumservices.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">www.premiumservices.com</span>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div>
              <h3 className="font-semibold mb-3">Operating Hours</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span>8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Achievements */}
        <div className="space-y-6">
          {/* Business Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Business Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {businessStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-card rounded-lg flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Recognition and milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-primary mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                    </div>
                  </div>
                  {index < achievements.length - 1 && <div className="border-b border-border" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}