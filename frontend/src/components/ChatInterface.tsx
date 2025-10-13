import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { VoiceCall } from "./VoiceCall";
import { N8nIntegration } from "./N8nIntegration";
import { Send, Phone, Settings, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Mock artisan data
const artisanProducts = [
  {
    name: "Handmade Pottery Bowl",
    price: 800,
    artisan: "Asha Devi",
    location: "Jaipur",
    story: "Traditional blue pottery technique passed down through generations"
  },
  {
    name: "Bamboo Basket Set",
    price: 500,
    artisan: "Ramesh Kumar",
    location: "Assam",
    story: "Sustainable bamboo weaving supporting local forest communities"
  },
  {
    name: "Silver Jhumka Earrings",
    price: 1200,
    artisan: "Meera Sharma",
    location: "Udaipur",
    story: "Intricate silver work inspired by Rajasthani heritage"
  }
];

export function ChatInterface() {
  console.log("ChatInterface component mounting");
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Welcome! I'm your AI assistant for local artisans. I can help you discover beautiful handcrafted products or guide you as an artisan. What would you like to explore today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [activeView, setActiveView] = useState<"chat" | "voice" | "settings">("chat");
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState("");
  const [n8nEnabled, setN8nEnabled] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  console.log("Current active view:", activeView);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Product discovery
    if (lowerMessage.includes("pottery") || lowerMessage.includes("bowl")) {
      const product = artisanProducts[0];
      return `I found a beautiful ${product.name} by ${product.artisan} from ${product.location} for ₹${product.price}. ${product.story}. Would you like to know more about this or see similar items?`;
    }

    if (lowerMessage.includes("basket") || lowerMessage.includes("bamboo")) {
      const product = artisanProducts[1];
      return `Check out this ${product.name} by ${product.artisan} from ${product.location} for ₹${product.price}. ${product.story}. It's perfect for sustainable living!`;
    }

    if (lowerMessage.includes("jewelry") || lowerMessage.includes("earring") || lowerMessage.includes("silver")) {
      const product = artisanProducts[2];
      return `These gorgeous ${product.name} by ${product.artisan} from ${product.location} are priced at ₹${product.price}. ${product.story}. They make perfect gifts!`;
    }

    // Price-based queries
    if (lowerMessage.includes("under") && lowerMessage.includes("1000")) {
      const affordableProducts = artisanProducts.filter(p => p.price < 1000);
      return `Here are handcrafted items under ₹1000: ${affordableProducts.map(p => `${p.name} (₹${p.price}) by ${p.artisan}`).join(", ")}. Each piece tells a unique story!`;
    }

    // Artisan guidance
    if (lowerMessage.includes("how") && (lowerMessage.includes("list") || lowerMessage.includes("upload") || lowerMessage.includes("sell"))) {
      return "To list your products on our marketplace: 1) Take high-quality photos of your crafts, 2) Write compelling descriptions including your story, 3) Set competitive prices, 4) Include your location and materials used. I can help you craft the perfect listing!";
    }

    if (lowerMessage.includes("artisan") || lowerMessage.includes("maker") || lowerMessage.includes("craft")) {
      return "Our platform supports local artisans by connecting them directly with customers. You can share your craft story, set your own prices, and reach customers who value authentic handmade products. What type of crafts do you create?";
    }

    // General responses
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! I'm excited to help you explore the wonderful world of local artisan crafts. Are you looking to discover unique handmade products, or are you an artisan wanting to showcase your work?";
    }

    return "That's a great question! I can help you discover amazing artisan products by price, type, or location. I can also guide artisans on how to list their products effectively. What specific information are you looking for?";
  };

  const sendToN8n = async (message: string, userType: "customer" | "artisan" = "customer") => {
    if (n8nEnabled && n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify({
            message,
            timestamp: new Date().toISOString(),
            user: userType,
            context: "product discovery",
          }),
        });
      } catch (error) {
        console.error("Failed to send to n8n:", error);
      }
    }
  };

  const handleSendMessage = async () => {
    console.log("Send message clicked");
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Send to n8n if enabled
    await sendToN8n(inputValue);
    
    const messageToProcess = inputValue;
    setInputValue("");

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(messageToProcess),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleViewChange = (view: "chat" | "voice" | "settings") => {
    console.log("Changing view to:", view);
    setActiveView(view);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* View Selection */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={activeView === "chat" ? "default" : "outline"}
          onClick={() => handleViewChange("chat")}
          className="bg-gradient-primary"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Text Chat
        </Button>
        <Button
          variant={activeView === "voice" ? "default" : "outline"}
          onClick={() => handleViewChange("voice")}
          className="bg-gradient-primary"
        >
          <Phone className="w-4 h-4 mr-2" />
          Voice Call
        </Button>
        <Button
          variant={activeView === "settings" ? "default" : "outline"}
          onClick={() => handleViewChange("settings")}
          className="bg-gradient-primary"
        >
          <Settings className="w-4 h-4 mr-2" />
          n8n Settings
        </Button>
      </div>

      {/* Content based on current view */}
      {activeView === "chat" && (
        <Card className="h-[600px] flex flex-col shadow-warm">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Text Chat Assistant</h3>
              {n8nEnabled && (
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  n8n Connected
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isBot={message.isBot}
                  timestamp={message.timestamp}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about artisan products or how to list your crafts..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                disabled={!inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {activeView === "voice" && (
        <VoiceCall onClose={() => handleViewChange("chat")} />
      )}

      {activeView === "settings" && (
        <N8nIntegration
          webhookUrl={n8nWebhookUrl}
          setWebhookUrl={setN8nWebhookUrl}
          isEnabled={n8nEnabled}
          setIsEnabled={setN8nEnabled}
        />
      )}
    </div>
  );
}