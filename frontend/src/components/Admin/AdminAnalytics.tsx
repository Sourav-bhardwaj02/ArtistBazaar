import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, Target, Award, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const growthData = [
  { month: "Jan", revenue: 4000, users: 240, orders: 180 },
  { month: "Feb", revenue: 5500, users: 320, orders: 220 },
  { month: "Mar", revenue: 7200, users: 450, orders: 280 },
  { month: "Apr", revenue: 8900, users: 580, orders: 340 },
  { month: "May", revenue: 11200, users: 720, orders: 420 },
  { month: "Jun", revenue: 13800, users: 890, orders: 520 },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "hsl(var(--primary))" },
  { name: "Fashion", value: 28, color: "hsl(var(--accent))" },
  { name: "Home & Garden", value: 22, color: "hsl(var(--success))" },
  { name: "Sports", value: 15, color: "hsl(var(--warning))" },
];

const achievements = [
  { 
    title: "Monthly Target Achieved", 
    description: "Reached 110% of monthly revenue target",
    icon: Target,
    value: "110%",
    status: "success"
  },
  { 
    title: "User Growth Milestone", 
    description: "Crossed 10,000 active users",
    icon: Users,
    value: "10K+",
    status: "success"
  },
  { 
    title: "Best Month Ever", 
    description: "Highest revenue recorded in company history",
    icon: Award,
    value: "$13.8K",
    status: "success"
  },
  { 
    title: "Customer Satisfaction", 
    description: "95% customer satisfaction rate",
    icon: TrendingUp,
    value: "95%",
    status: "success"
  },
];

const kpiData = [
  { name: "Revenue", current: 13800, target: 12000, unit: "$" },
  { name: "Users", current: 890, target: 800, unit: "" },
  { name: "Orders", current: 520, target: 500, unit: "" },
  { name: "Conversion", current: 4.2, target: 3.5, unit: "%" },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your platform's growth, achievements, and key performance indicators
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.name} className="shadow-card hover:shadow-elegant transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi.unit === "$" ? "$" : ""}{kpi.current}{kpi.unit !== "$" && kpi.unit !== "" ? kpi.unit : ""}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-muted-foreground">
                  {((kpi.current / kpi.target) * 100).toFixed(0)}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Revenue Growth
            </CardTitle>
            <CardDescription>Monthly revenue trend over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">Revenue Growth</div>
              <div className="text-sm text-muted-foreground">Monthly trend shows +23% growth</div>
            </div>
          </CardContent>
        </Card>

        {/* User & Order Growth */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User & Order Growth
            </CardTitle>
            <CardDescription>Tracking user acquisition and order volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">User Growth</div>
              <div className="text-sm text-muted-foreground">+18% user acquisition this month</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution of sales across different product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recent Achievements
            </CardTitle>
            <CardDescription>Key milestones and accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gradient-success/10 border border-success/20">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-success flex items-center justify-center">
                      <achievement.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <Badge className="bg-success text-success-foreground">
                        {achievement.value}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Performance Summary
          </CardTitle>
          <CardDescription>Overview of key metrics for the current month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-gradient-subtle border">
              <div className="text-3xl font-bold text-primary mb-2">+23%</div>
              <div className="text-sm text-muted-foreground">Revenue Growth</div>
              <div className="text-xs text-success mt-1">vs. last month</div>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-subtle border">
              <div className="text-3xl font-bold text-accent mb-2">+18%</div>
              <div className="text-sm text-muted-foreground">User Acquisition</div>
              <div className="text-xs text-success mt-1">vs. last month</div>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-subtle border">
              <div className="text-3xl font-bold text-success mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              <div className="text-xs text-success mt-1">Above target</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}