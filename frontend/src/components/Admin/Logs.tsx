import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Filter, Download, RefreshCw, User, LogIn, LogOut, AlertTriangle, Info } from "lucide-react";

const logEntries = [
  {
    id: 1,
    timestamp: "2024-01-15 14:32:15",
    type: "login",
    level: "info",
    user: "john@example.com",
    action: "User login successful",
    ip: "192.168.1.100",
    userAgent: "Chrome 120.0.0.0",
    details: "Login via email/password"
  },
  {
    id: 2,
    timestamp: "2024-01-15 14:28:42",
    type: "logout", 
    level: "info",
    user: "sarah@example.com",
    action: "User logout",
    ip: "192.168.1.105",
    userAgent: "Firefox 121.0.0.0",
    details: "Manual logout"
  },
  {
    id: 3,
    timestamp: "2024-01-15 14:25:33",
    type: "login",
    level: "warning",
    user: "admin@example.com",
    action: "Failed login attempt",
    ip: "192.168.1.200",
    userAgent: "Chrome 120.0.0.0",
    details: "Invalid password (3rd attempt)"
  },
  {
    id: 4,
    timestamp: "2024-01-15 14:22:18",
    type: "login",
    level: "info",
    user: "mike@example.com",
    action: "User login successful",
    ip: "192.168.1.110",
    userAgent: "Safari 17.2.0",
    details: "Login via social auth (Google)"
  },
  {
    id: 5,
    timestamp: "2024-01-15 14:18:05",
    type: "system",
    level: "error",
    user: "system",
    action: "Database connection error",
    ip: "127.0.0.1",
    userAgent: "System",
    details: "Connection timeout after 30s"
  },
  {
    id: 6,
    timestamp: "2024-01-15 14:15:22",
    type: "logout",
    level: "info", 
    user: "emma@example.com",
    action: "Session timeout",
    ip: "192.168.1.115",
    userAgent: "Edge 120.0.0.0",
    details: "Automatic logout after 2h inactivity"
  },
  {
    id: 7,
    timestamp: "2024-01-15 14:12:44",
    type: "login",
    level: "info",
    user: "david@example.com", 
    action: "User login successful",
    ip: "192.168.1.120",
    userAgent: "Chrome 120.0.0.0",
    details: "Login via email/password"
  },
  {
    id: 8,
    timestamp: "2024-01-15 14:08:17",
    type: "security",
    level: "warning",
    user: "system",
    action: "Suspicious login pattern detected",
    ip: "192.168.1.200",
    userAgent: "Unknown",
    details: "Multiple failed attempts from same IP"
  },
];

const logStats = [
  { label: "Total Logins Today", value: 89, change: "+12%", type: "login" },
  { label: "Total Logouts Today", value: 76, change: "+8%", type: "logout" },
  { label: "Failed Attempts", value: 12, change: "-5%", type: "warning" },
  { label: "Active Sessions", value: 43, change: "+15%", type: "active" },
];

export default function Logs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const filteredLogs = logEntries.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ip.includes(searchTerm);
    const matchesType = selectedType === "all" || log.type === selectedType;
    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel;
    return matchesSearch && matchesType && matchesLevel;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login': return <LogIn className="w-4 h-4" />;
      case 'logout': return <LogOut className="w-4 h-4" />;
      case 'security': return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Logs</h1>
          <p className="text-muted-foreground mt-2">
            Monitor user activities, logins, logouts, and system events
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-primary hover:shadow-glow">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {logStats.map((stat, index) => (
          <Card key={index} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              {stat.type === 'login' && <LogIn className="h-4 w-4 text-muted-foreground" />}
              {stat.type === 'logout' && <LogOut className="h-4 w-4 text-muted-foreground" />}
              {stat.type === 'warning' && <AlertTriangle className="h-4 w-4 text-muted-foreground" />}
              {stat.type === 'active' && <User className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                {stat.change} from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Logs
          </CardTitle>
          <CardDescription>Search and filter log entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, action, or IP address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background min-w-[120px]"
            >
              <option value="all">All Types</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="security">Security</option>
              <option value="system">System</option>
            </select>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background min-w-[120px]"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Activity Logs
          </CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {logEntries.length} log entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{log.action}</p>
                        <Badge variant={getLevelColor(log.level)}>
                          {log.level}
                        </Badge>
                        <Badge variant="outline">
                          {log.type}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">User:</span> {log.user}
                        </div>
                        <div>
                          <span className="font-medium">IP:</span> {log.ip}
                        </div>
                        <div>
                          <span className="font-medium">Browser:</span> {log.userAgent}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {log.timestamp}
                        </div>
                      </div>
                      {log.details && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <span className="font-medium">Details:</span> {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No log entries match your current filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}