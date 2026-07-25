import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Database, Plus, Search, Edit, Trash2, Eye } from "lucide-react";

// Mock data for different entities
const entityData: Record<string, any[]> = {
  product: [
    { id: 1, name: "Wireless Headphones", category: "Electronics", price: 99.99, stock: 25, status: "active" },
    { id: 2, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 15, status: "active" },
    { id: 3, name: "Running Shoes", category: "Fashion", price: 79.99, stock: 0, status: "out_of_stock" },
  ],
  order: [
    { id: 1001, customer: "John Doe", total: 299.98, status: "delivered", date: "2024-01-15", items: 2 },
    { id: 1002, customer: "Sarah Johnson", total: 79.99, status: "processing", date: "2024-01-14", items: 1 },
    { id: 1003, customer: "Mike Wilson", total: 199.99, status: "shipped", date: "2024-01-13", items: 1 },
  ],
  cartitem: [
    { id: 1, user: "john@example.com", product: "Wireless Headphones", quantity: 1, price: 99.99 },
    { id: 2, user: "sarah@example.com", product: "Smart Watch", quantity: 1, price: 199.99 },
  ],
  wishlistitem: [
    { id: 1, user: "john@example.com", product: "Running Shoes", addedDate: "2024-01-10" },
    { id: 2, user: "mike@example.com", product: "Smart Watch", addedDate: "2024-01-12" },
  ],
  category: [
    { id: 1, name: "Electronics", description: "Electronic devices and gadgets", productCount: 150, status: "active" },
    { id: 2, name: "Fashion", description: "Clothing and accessories", productCount: 89, status: "active" },
    { id: 3, name: "Home & Garden", description: "Home improvement and garden items", productCount: 45, status: "active" },
  ],
  paymentgateway: [
    { id: 1, name: "Stripe", type: "Credit Card", status: "active", lastTransaction: "2024-01-15" },
    { id: 2, name: "PayPal", type: "Digital Wallet", status: "active", lastTransaction: "2024-01-14" },
    { id: 3, name: "Bank Transfer", type: "Bank", status: "inactive", lastTransaction: "2024-01-10" },
  ],
  deliverypartner: [
    { id: 1, name: "FastShip Express", coverage: "Nationwide", rating: 4.8, activeOrders: 25 },
    { id: 2, name: "Quick Delivery Co", coverage: "Regional", rating: 4.5, activeOrders: 18 },
  ],
  productoption: [
    { id: 1, product: "Wireless Headphones", option: "Color", values: "Black, White, Blue" },
    { id: 2, product: "Smart Watch", option: "Size", values: "S, M, L, XL" },
  ],
  review: [
    { id: 1, product: "Wireless Headphones", user: "john@example.com", rating: 5, comment: "Great sound quality!", date: "2024-01-12" },
    { id: 2, product: "Smart Watch", user: "sarah@example.com", rating: 4, comment: "Good features, battery could be better", date: "2024-01-10" },
  ],
  coupon: [
    { id: 1, code: "SAVE20", discount: "20%", type: "percentage", expiry: "2024-02-15", uses: 45, maxUses: 100 },
    { id: 2, code: "NEWUSER", discount: "$10", type: "fixed", expiry: "2024-03-01", uses: 23, maxUses: 50 },
  ],
  banner: [
    { id: 1, title: "Summer Sale", position: "homepage", status: "active", clicks: 1250, impressions: 15000 },
    { id: 2, title: "New Arrivals", position: "category", status: "active", clicks: 890, impressions: 8500 },
  ],
};

export default function DataEntity() {
  const { entity } = useParams<{ entity: string }>();
  const entityName = entity || 'product';
  const data = entityData[entityName] || [];

  const getEntityDisplayName = (entity: string) => {
    return entity.charAt(0).toUpperCase() + entity.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const renderTableHeaders = (entity: string) => {
    switch (entity) {
      case 'product':
        return ['Name', 'Category', 'Price', 'Stock', 'Status'];
      case 'order':
        return ['Order ID', 'Customer', 'Total', 'Status', 'Date', 'Items'];
      case 'cartitem':
        return ['User', 'Product', 'Quantity', 'Price'];
      case 'wishlistitem':
        return ['User', 'Product', 'Added Date'];
      case 'category':
        return ['Name', 'Description', 'Products', 'Status'];
      case 'paymentgateway':
        return ['Name', 'Type', 'Status', 'Last Transaction'];
      case 'deliverypartner':
        return ['Name', 'Coverage', 'Rating', 'Active Orders'];
      case 'productoption':
        return ['Product', 'Option', 'Values'];
      case 'review':
        return ['Product', 'User', 'Rating', 'Comment', 'Date'];
      case 'coupon':
        return ['Code', 'Discount', 'Type', 'Expiry', 'Uses'];
      case 'banner':
        return ['Title', 'Position', 'Status', 'Clicks', 'Impressions'];
      default:
        return ['ID', 'Name', 'Status'];
    }
  };

  const renderTableRow = (item: any, entity: string) => {
    switch (entity) {
      case 'product':
        return (
          <>
            <td className="p-4 font-medium">{item.name}</td>
            <td className="p-4">{item.category}</td>
            <td className="p-4">${item.price}</td>
            <td className="p-4">{item.stock}</td>
            <td className="p-4">
              <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                {item.status.replace('_', ' ')}
              </Badge>
            </td>
          </>
        );
      case 'order':
        return (
          <>
            <td className="p-4 font-medium">#{item.id}</td>
            <td className="p-4">{item.customer}</td>
            <td className="p-4">${item.total}</td>
            <td className="p-4">
              <Badge variant={
                item.status === 'delivered' ? 'default' : 
                item.status === 'processing' ? 'secondary' : 'outline'
              }>
                {item.status}
              </Badge>
            </td>
            <td className="p-4">{item.date}</td>
            <td className="p-4">{item.items}</td>
          </>
        );
      case 'cartitem':
        return (
          <>
            <td className="p-4">{item.user}</td>
            <td className="p-4 font-medium">{item.product}</td>
            <td className="p-4">{item.quantity}</td>
            <td className="p-4">${item.price}</td>
          </>
        );
      case 'wishlistitem':
        return (
          <>
            <td className="p-4">{item.user}</td>
            <td className="p-4 font-medium">{item.product}</td>
            <td className="p-4">{item.addedDate}</td>
          </>
        );
      case 'category':
        return (
          <>
            <td className="p-4 font-medium">{item.name}</td>
            <td className="p-4">{item.description}</td>
            <td className="p-4">{item.productCount}</td>
            <td className="p-4">
              <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                {item.status}
              </Badge>
            </td>
          </>
        );
      case 'paymentgateway':
        return (
          <>
            <td className="p-4 font-medium">{item.name}</td>
            <td className="p-4">{item.type}</td>
            <td className="p-4">
              <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                {item.status}
              </Badge>
            </td>
            <td className="p-4">{item.lastTransaction}</td>
          </>
        );
      case 'deliverypartner':
        return (
          <>
            <td className="p-4 font-medium">{item.name}</td>
            <td className="p-4">{item.coverage}</td>
            <td className="p-4">⭐ {item.rating}</td>
            <td className="p-4">{item.activeOrders}</td>
          </>
        );
      case 'productoption':
        return (
          <>
            <td className="p-4 font-medium">{item.product}</td>
            <td className="p-4">{item.option}</td>
            <td className="p-4">{item.values}</td>
          </>
        );
      case 'review':
        return (
          <>
            <td className="p-4 font-medium">{item.product}</td>
            <td className="p-4">{item.user}</td>
            <td className="p-4">⭐ {item.rating}</td>
            <td className="p-4 max-w-xs truncate">{item.comment}</td>
            <td className="p-4">{item.date}</td>
          </>
        );
      case 'coupon':
        return (
          <>
            <td className="p-4 font-medium">{item.code}</td>
            <td className="p-4">{item.discount}</td>
            <td className="p-4">{item.type}</td>
            <td className="p-4">{item.expiry}</td>
            <td className="p-4">{item.uses}/{item.maxUses}</td>
          </>
        );
      case 'banner':
        return (
          <>
            <td className="p-4 font-medium">{item.title}</td>
            <td className="p-4">{item.position}</td>
            <td className="p-4">
              <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                {item.status}
              </Badge>
            </td>
            <td className="p-4">{item.clicks}</td>
            <td className="p-4">{item.impressions}</td>
          </>
        );
      default:
        return (
          <>
            <td className="p-4">{item.id}</td>
            <td className="p-4">{item.name || 'N/A'}</td>
            <td className="p-4">Active</td>
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{getEntityDisplayName(entityName)} Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view all {entityName} records in your system
          </p>
        </div>
        <Button className="bg-gradient-primary hover:shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add New {getEntityDisplayName(entityName)}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">Total {entityName} entries</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter(item => item.status === 'active' || !item.status).length}
            </div>
            <p className="text-xs text-success">Active records</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(data.length * 0.3)}
            </div>
            <p className="text-xs text-muted-foreground">Added this week</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modified</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(data.length * 0.2)}
            </div>
            <p className="text-xs text-muted-foreground">Modified today</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            {getEntityDisplayName(entityName)} Records
          </CardTitle>
          <CardDescription>
            Complete list of all {entityName} entries
          </CardDescription>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={`Search ${entityName}...`} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {renderTableHeaders(entityName).map((header, index) => (
                    <th key={index} className="text-left p-4 font-medium">{header}</th>
                  ))}
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30">
                    {renderTableRow(item, entityName)}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.length === 0 && (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No {entityName} records found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}