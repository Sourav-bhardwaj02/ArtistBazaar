import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users as UsersIcon, UserPlus, Search, Filter, Calendar, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

const users = [
  { id: 1, role: "admin", email: "shruti0505sharma@gmail.com", fullName: "Kenny Bhardwaj", phone: "7830050265", address: "rzyrui7uii76", status: "active", lastLogin: "2024-01-15" },
  { id: 2, role: "user", email: "aaudse@gmail.com", fullName: "Udse Aa", phone: "", address: "", status: "active", lastLogin: "2024-01-14" },
  { id: 3, role: "user", email: "praveensingh131415@gmail.com", fullName: "Praveen Singh", phone: "", address: "", status: "active", lastLogin: "2024-01-13" },
  { id: 4, role: "user", email: "prs97943@gmail.com", fullName: "05 Praveen Singh", phone: "", address: "", status: "inactive", lastLogin: "2024-01-10" },
  { id: 5, role: "user", email: "souravbhardwaj2005@gmail.com", fullName: "Sourav Bhardwaj", phone: "", address: "", status: "active", lastLogin: "2024-01-15" },
];

const dailyLogins = [
  { date: "Jan 10", logins: 45 },
  { date: "Jan 11", logins: 52 },
  { date: "Jan 12", logins: 38 },
  { date: "Jan 13", logins: 67 },
  { date: "Jan 14", logins: 72 },
  { date: "Jan 15", logins: 89 },
  { date: "Jan 16", logins: 94 },
];

const userGrowth = [
  { month: "Aug", users: 1200 },
  { month: "Sep", users: 1350 },
  { month: "Oct", users: 1480 },
  { month: "Nov", users: 1620 },
  { month: "Dec", users: 1780 },
  { month: "Jan", users: 1950 },
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const activeUsers = users.filter(u => u.status === "active").length;
  const totalUsers = users.length;
  const todayLogins = dailyLogins[dailyLogins.length - 1]?.logins || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground mt-2">Manage users and monitor their activities</p>
        </div>
        <Button className="bg-gradient-primary hover:shadow-glow">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-success">+8% from last week</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Logins</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLogins}</div>
            <p className="text-xs text-success">+15% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === "admin").length}</div>
            <p className="text-xs text-muted-foreground">Admin users</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Logins Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Daily Login Activity</CardTitle>
            <CardDescription>User login trends over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">Daily Logins</div>
              <div className="text-sm text-muted-foreground">94 logins today (+15% from yesterday)</div>
            </div>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user registration growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="users" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Complete list of registered users</CardDescription>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Full Name</th>
                  <th className="text-left p-4 font-medium">Phone</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/30">
                    <td className="p-4">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{user.email}</td>
                    <td className="p-4 font-medium">{user.fullName}</td>
                    <td className="p-4 text-sm">{user.phone || "—"}</td>
                    <td className="p-4">
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{user.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}