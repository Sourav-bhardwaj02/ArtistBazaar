import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, XCircle, Play, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const securityChecks = [
  {
    id: 1,
    name: "SSL Certificate",
    status: "passed",
    description: "SSL certificate is valid and properly configured",
    severity: "high",
    lastChecked: "2 mins ago"
  },
  {
    id: 2,
    name: "Database Security",
    status: "passed", 
    description: "Database access controls and encryption are properly configured",
    severity: "critical",
    lastChecked: "5 mins ago"
  },
  {
    id: 3,
    name: "API Rate Limiting",
    status: "warning",
    description: "Some endpoints are missing rate limiting protection",
    severity: "medium",
    lastChecked: "10 mins ago"
  },
  {
    id: 4,
    name: "Password Policies",
    status: "passed",
    description: "Strong password requirements are enforced",
    severity: "high",
    lastChecked: "15 mins ago"
  },
  {
    id: 5,
    name: "Data Backup",
    status: "failed",
    description: "Last backup was more than 24 hours ago",
    severity: "critical",
    lastChecked: "1 hour ago"
  },
  {
    id: 6,
    name: "Network Security",
    status: "passed",
    description: "Firewall and network access controls are properly configured",
    severity: "high",
    lastChecked: "30 mins ago"
  },
];

const vulnerabilities = [
  {
    id: 1,
    title: "Outdated Dependencies",
    severity: "medium",
    description: "3 npm packages have security updates available",
    affectedSystems: ["Frontend", "Backend"],
    status: "open"
  },
  {
    id: 2,
    title: "Missing CSRF Protection",
    severity: "high",
    description: "Some forms are missing CSRF token validation",
    affectedSystems: ["Backend API"],
    status: "in_progress"
  },
  {
    id: 3,
    title: "Weak Session Configuration",
    severity: "low",
    description: "Session timeout could be more restrictive",
    affectedSystems: ["Authentication"],
    status: "resolved"
  },
];

const systemHealth = [
  { component: "Authentication Service", status: "healthy", uptime: "99.9%", lastCheck: "1 min ago" },
  { component: "Database Cluster", status: "healthy", uptime: "99.8%", lastCheck: "2 mins ago" },
  { component: "API Gateway", status: "degraded", uptime: "98.5%", lastCheck: "1 min ago" },
  { component: "File Storage", status: "healthy", uptime: "99.7%", lastCheck: "3 mins ago" },
  { component: "Monitoring System", status: "healthy", uptime: "99.9%", lastCheck: "1 min ago" },
];

export default function Security() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleSecurityScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scanning process
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const passedChecks = securityChecks.filter(check => check.status === 'passed').length;
  const failedChecks = securityChecks.filter(check => check.status === 'failed').length;
  const warningChecks = securityChecks.filter(check => check.status === 'warning').length;
  const totalChecks = securityChecks.length;
  const healthScore = Math.round((passedChecks / totalChecks) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Security Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor system security, run diagnostics, and manage vulnerabilities
          </p>
        </div>
        <Button 
          onClick={handleSecurityScan}
          disabled={isScanning}
          className="bg-gradient-primary hover:shadow-glow"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run Security Scan
            </>
          )}
        </Button>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthScore}%</div>
            <Progress value={healthScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {passedChecks}/{totalChecks} checks passed
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed Checks</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{passedChecks}</div>
            <p className="text-xs text-success">All systems secure</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{warningChecks}</div>
            <p className="text-xs text-warning">Needs attention</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Checks</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{failedChecks}</div>
            <p className="text-xs text-destructive">Immediate action needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Scanning Progress */}
      {isScanning && (
        <Card className="shadow-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              Security Scan in Progress
            </CardTitle>
            <CardDescription>Running comprehensive security diagnostics...</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={scanProgress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">{scanProgress}% Complete</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Checks */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Security Diagnostics
            </CardTitle>
            <CardDescription>Results from the latest security assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityChecks.map((check) => (
                <div key={check.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {check.status === 'passed' && <CheckCircle className="w-5 h-5 text-success" />}
                    {check.status === 'warning' && <AlertTriangle className="w-5 h-5 text-warning" />}
                    {check.status === 'failed' && <XCircle className="w-5 h-5 text-destructive" />}
                    <div>
                      <p className="font-medium">{check.name}</p>
                      <p className="text-sm text-muted-foreground">{check.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        check.status === 'passed' ? 'default' : 
                        check.status === 'warning' ? 'secondary' : 'destructive'
                      }
                      className={
                        check.status === 'passed' ? 'bg-success text-success-foreground' : ''
                      }
                    >
                      {check.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{check.lastChecked}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              System Health Monitor
            </CardTitle>
            <CardDescription>Real-time status of critical system components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((system, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      system.status === 'healthy' ? 'bg-success' : 
                      system.status === 'degraded' ? 'bg-warning' : 'bg-destructive'
                    }`} />
                    <div>
                      <p className="font-medium">{system.component}</p>
                      <p className="text-sm text-muted-foreground">Uptime: {system.uptime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={system.status === 'healthy' ? 'default' : 'secondary'}>
                      {system.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{system.lastCheck}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vulnerabilities */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Security Vulnerabilities
          </CardTitle>
          <CardDescription>Known security issues and their remediation status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vulnerabilities.map((vuln) => (
              <div key={vuln.id} className="p-4 rounded-lg border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{vuln.title}</h4>
                      <Badge 
                        variant={
                          vuln.severity === 'critical' ? 'destructive' :
                          vuln.severity === 'high' ? 'destructive' :
                          vuln.severity === 'medium' ? 'secondary' : 'outline'
                        }
                      >
                        {vuln.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{vuln.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Affected:</span>
                      {vuln.affectedSystems.map((system, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge 
                    variant={
                      vuln.status === 'resolved' ? 'default' :
                      vuln.status === 'in_progress' ? 'secondary' : 'outline'
                    }
                    className={vuln.status === 'resolved' ? 'bg-success text-success-foreground' : ''}
                  >
                    {vuln.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}