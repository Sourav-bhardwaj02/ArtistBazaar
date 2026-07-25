import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings, Webhook, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface N8nIntegrationProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
}

export function N8nIntegration({ 
  webhookUrl, 
  setWebhookUrl, 
  isEnabled, 
  setIsEnabled 
}: N8nIntegrationProps) {
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const { toast } = useToast();

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "No Webhook URL",
        description: "Please enter your n8n webhook URL first",
        variant: "destructive",
      });
      return;
    }

    setIsTestingWebhook(true);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          message: "Test message from Artisan Assistant",
          timestamp: new Date().toISOString(),
          user: "system",
        }),
      });

      toast({
        title: "Webhook Test Sent",
        description: "Check your n8n workflow to see if the test was received",
      });
    } catch (error) {
      console.error("Error testing webhook:", error);
      toast({
        title: "Test Failed",
        description: "Failed to send test request to n8n webhook",
        variant: "destructive",
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <Card className="p-4 border-2 border-dashed border-border">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">n8n Backend Integration</h3>
        <Badge variant="outline" className="ml-auto">
          <Webhook className="w-3 h-3 mr-1" />
          Automation
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="n8n-enabled" className="text-sm font-medium">
            Enable n8n Integration
          </Label>
          <Switch
            id="n8n-enabled"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div>

        {isEnabled && (
          <>
            <div>
              <Label htmlFor="webhook-url" className="text-sm font-medium">
                n8n Webhook URL
              </Label>
              <Input
                id="webhook-url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-n8n-instance.com/webhook/..."
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Create a webhook trigger in your n8n workflow and paste the URL here
              </p>
            </div>

            <Button
              variant="outline"
              onClick={testWebhook}
              disabled={!webhookUrl || isTestingWebhook}
              className="w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isTestingWebhook ? "Testing..." : "Test Webhook"}
            </Button>

            <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground">
              <p className="font-medium mb-1">Expected webhook payload:</p>
              <pre className="text-xs">
{`{
  "message": "user message",
  "timestamp": "ISO date",
  "user": "customer|artisan",
  "context": "product discovery"
}`}
              </pre>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}