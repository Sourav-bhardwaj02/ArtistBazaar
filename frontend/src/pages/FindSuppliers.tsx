import { useState } from "react";
import { Layout } from "@/components/PanelLout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  Star,
  Building2,
  Phone,
  Mail,
  Globe,
  Filter,
  Heart,
  MessageCircle,
  CheckCircle
} from "lucide-react";

const suppliers = [
  {
    id: 1,
    name: "TechFlow Industries",
    location: "Munich, Germany",
    rating: 4.8,
    reviews: 127,
    categories: ["Industrial Equipment", "Automation"],
    certifications: ["ISO 9001", "CE Certified"],
    established: 2010,
    employees: "500-1000",
    description: "Leading supplier of industrial automation equipment and custom manufacturing solutions.",
    specialties: ["Custom Manufacturing", "Quality Assurance", "Fast Delivery"],
    phone: "+49 89 123456",
    email: "contact@techflow.de",
    website: "www.techflow.de",
    verified: true,
    responseTime: "< 2 hours",
    minOrder: "₹1,000"
  },
  {
    id: 2,
    name: "MetalWorks Corporation",
    location: "Detroit, USA",
    rating: 4.6,
    reviews: 89,
    categories: ["Steel Components", "Raw Materials"],
    certifications: ["ASME", "AWS Certified"],
    established: 2005,
    employees: "100-500",
    description: "Specialized in precision steel components and metal fabrication services.",
    specialties: ["Precision Manufacturing", "Custom Fabrication", "Bulk Orders"],
    phone: "+1 313 555-0123",
    email: "sales@metalworks.com",
    website: "www.metalworks.com",
    verified: true,
    responseTime: "< 4 hours",
    minOrder: "₹500"
  },
  {
    id: 3,
    name: "CircuitMax Electronics",
    location: "Tokyo, Japan",
    rating: 4.9,
    reviews: 203,
    categories: ["Electronics", "Components"],
    certifications: ["RoHS", "UL Listed"],
    established: 1998,
    employees: "1000+",
    description: "Premium electronic components and PCB manufacturing with cutting-edge technology.",
    specialties: ["High Quality", "Fast Prototyping", "Technical Support"],
    phone: "+81 3 1234-5678",
    email: "info@circuitmax.jp",
    website: "www.circuitmax.jp",
    verified: true,
    responseTime: "< 1 hour",
    minOrder: "₹200"
  },
  {
    id: 4,
    name: "SafeGuard Equipment",
    location: "London, UK",
    rating: 4.7,
    reviews: 156,
    categories: ["Safety Equipment", "PPE"],
    certifications: ["CE", "UKCA"],
    established: 2012,
    employees: "50-100",
    description: "Comprehensive safety equipment solutions for industrial and commercial applications.",
    specialties: ["Safety Compliance", "Training Support", "Bulk Pricing"],
    phone: "+44 20 7123 4567",
    email: "enquiries@safeguard.co.uk",
    website: "www.safeguard.co.uk",
    verified: false,
    responseTime: "< 8 hours",
    minOrder: "₹300"
  }
];

export default function FindSuppliers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [certificationFilter, setCertificationFilter] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (supplierId: number) => {
    setFavorites(prev => 
      prev.includes(supplierId) 
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || supplier.categories.some(cat => 
      cat.toLowerCase().includes(categoryFilter.toLowerCase())
    );
    const matchesLocation = !locationFilter || supplier.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesCertification = !certificationFilter || supplier.certifications.some(cert => 
      cert.toLowerCase().includes(certificationFilter.toLowerCase())
    );
    
    return matchesSearch && matchesCategory && matchesLocation && matchesCertification;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Find Suppliers</h1>
          <p className="text-muted-foreground">Discover and connect with verified suppliers worldwide.</p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers, products, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    <SelectItem value="industrial">Industrial Equipment</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="steel">Steel Components</SelectItem>
                    <SelectItem value="safety">Safety Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All locations</SelectItem>
                    <SelectItem value="usa">USA</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="japan">Japan</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Certification</Label>
                <Select value={certificationFilter} onValueChange={setCertificationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any certification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any certification</SelectItem>
                    <SelectItem value="iso">ISO 9001</SelectItem>
                    <SelectItem value="ce">CE Certified</SelectItem>
                    <SelectItem value="asme">ASME</SelectItem>
                    <SelectItem value="rohs">RoHS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Found {filteredSuppliers.length} suppliers
            </p>
            <Select defaultValue="rating">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="established">Most Established</SelectItem>
                <SelectItem value="response">Fastest Response</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Supplier Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="text-lg font-semibold">
                              {supplier.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-semibold">{supplier.name}</h3>
                              {supplier.verified && (
                                <CheckCircle className="h-5 w-5 text-success" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {supplier.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-warning text-warning" />
                                {supplier.rating} ({supplier.reviews} reviews)
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(supplier.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Heart className={`h-5 w-5 ${favorites.includes(supplier.id) ? 'fill-destructive text-destructive' : ''}`} />
                        </Button>
                      </div>

                      <p className="text-muted-foreground">{supplier.description}</p>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Categories</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {supplier.categories.map((category) => (
                              <Badge key={category} variant="secondary">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Specialties</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {supplier.specialties.map((specialty) => (
                              <Badge key={specialty} variant="outline">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Certifications</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {supplier.certifications.map((cert) => (
                              <Badge key={cert} className="bg-success/10 text-success border-success/20">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Supplier Details & Actions */}
                    <div className="lg:w-80 space-y-4">
                      <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <Label className="text-xs text-muted-foreground">Established</Label>
                            <p>{supplier.established}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Employees</Label>
                            <p>{supplier.employees}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Response Time</Label>
                            <p className="text-success">{supplier.responseTime}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Min Order</Label>
                            <p>{supplier.minOrder}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {supplier.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {supplier.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          {supplier.website}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button className="w-full">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Request Quote
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Building2 className="mr-2 h-4 w-4" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}