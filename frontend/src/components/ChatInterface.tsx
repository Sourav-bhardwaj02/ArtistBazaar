import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { Send, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchRAGContext } from "@/lib/ragContext";
import { fetchWithRetry, Message as GeminiMessage } from "@/lib/gemini";
import { buildSystemInstruction, translations } from "@/lib/translations";
import { loadChatHistory, saveChatHistory, clearChatHistory } from "@/lib/chatStorage";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatInterface() {
  const t = translations.en;

  // Initialize messages from 3-hour persistent chatStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = loadChatHistory(t.welcome);
    return stored.map((m, idx) => ({
      id: `${Date.now()}-${idx}`,
      text: m.content,
      isBot: m.role === "model",
      timestamp: new Date(),
    }));
  });

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  // Persist messages to chatStorage
  useEffect(() => {
    if (messages.length > 0) {
      const geminiFormat: GeminiMessage[] = messages.map((m) => ({
        role: m.isBot ? "model" : "user",
        content: m.text,
      }));
      saveChatHistory(geminiFormat);
    }
  }, [messages]);

  const handleClearHistory = () => {
    clearChatHistory();
    setMessages([
      {
        id: Date.now().toString(),
        text: t.welcome,
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userText = inputValue.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      isBot: false,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setLoading(true);

    try {
      const chatHistory = updatedMessages.map((m) => ({
        role: m.isBot ? "model" : "user",
        parts: [{ text: m.text }],
      }));

      const productContext = await fetchRAGContext(userText);
      const systemInstruction = buildSystemInstruction(productContext, "en");

      const payload = {
        contents: chatHistory,
        systemInstruction: { parts: [{ text: systemInstruction }] },
      };

      const aiResponseText = await fetchWithRetry(
        payload,
        "I'm having trouble connecting to the AI assistant right now. Please try again in a moment."
      );

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isBot: true,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, botResponse];
      setMessages(finalMessages);
    } catch (error) {
      console.error("Gemini AI API Error:", error);
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble reaching the AI service right now. Please check your internet connection and try again.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Card className="h-[600px] flex flex-col shadow-warm overflow-hidden border border-border">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-primary text-primary-foreground rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          <Button
            onClick={handleClearHistory}
            size="sm"
            variant="ghost"
            className="text-xs px-2.5 py-1 rounded-lg border border-white/30 text-white hover:bg-white/20"
            title={t.clearHistory}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            {t.clearHistory}
          </Button>
        </div>

        {/* Persistent Notice Banner */}
        <div className="bg-orange-500/10 border-b border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs py-1.5 px-4 flex items-center justify-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{t.historyNotice}</span>
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
            {loading && (
              <div className="my-2">
                <TypingIndicator />
              </div>
            )}
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
              disabled={!inputValue.trim() || loading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}