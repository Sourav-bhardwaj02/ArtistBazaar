import { useState, useEffect, useRef, FormEvent } from "react";
import { X, Send, Globe, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { mockProductData } from "@/lib/productData";
import { translations, buildSystemInstruction } from "@/lib/translations";
import { fetchRAGContext } from "@/lib/ragContext";
import { fetchWithRetry, Message } from "@/lib/gemini";
import { loadChatHistory, saveChatHistory, clearChatHistory } from "@/lib/chatStorage";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
  const [currentLang, setCurrentLang] = useState<"en" | "hi">("en");
  const t = translations[currentLang];

  // Initialize messages from persisted localStorage (3-hour expiry)
  const [messages, setMessages] = useState<Message[]>(() => loadChatHistory(translations.en.welcome));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Persist messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    const newUserMessage: Message = { role: "user", content: userMessage };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);
    setLoading(true);

    try {
      // Construct chat history
      const chatHistory = updatedMessages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      // Fetch RAG context and build system instruction
      const productContext = await fetchRAGContext(userMessage);
      const systemInstruction = buildSystemInstruction(productContext, currentLang);

      const payload = {
        contents: chatHistory,
        systemInstruction: { parts: [{ text: systemInstruction }] },
      };

      // Make API call with retry
      const generatedText = await fetchWithRetry(payload, t.error);
      const finalMessages: Message[] = [...updatedMessages, { role: "model", content: generatedText }];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (error) {
      console.error("API error:", error);
      const errMessages: Message[] = [...updatedMessages, { role: "model", content: t.error }];
      setMessages(errMessages);
      saveChatHistory(errMessages);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    clearChatHistory();
    setMessages([{ role: "model", content: t.welcome }]);
  };

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-background/95 backdrop-blur-sm flex items-center justify-center z-[101] p-4 sm:p-8 animate-in fade-in duration-300">
      <div className=" relative mx-auto w-full max-w-4xl h-full max-h-[800px] bg-card rounded-3xl shadow-glow flex flex-col overflow-hidden border border-border">
        {/* Header */}
        <div className="gradient-primary text-primary p-5 font-bold text-lg shadow-medium flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <span className="truncate">{t.buttonTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              onClick={toggleLanguage}
              size="sm"
              variant="ghost"
              className="text-xs px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary/10 text-primary"
            >
              <Globe className="h-3 w-3 mr-1" />
              {t.langToggle}
            </Button>
            {/* Clear History Button */}
            <Button
              onClick={handleClearHistory}
              size="sm"
              variant="ghost"
              title={t.clearHistory}
              className="text-xs px-2.5 py-1 rounded-lg border border-primary/20 hover:bg-red-500/20 text-primary hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {t.clearHistory}
            </Button>
            {/* Close Button */}
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="rounded-full hover:bg-primary/10 text-primary"
              aria-label={t.closeChat}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Persistence Banner Notice */}
        <div className="bg-orange-500/10 border-b border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs py-1.5 px-4 flex items-center justify-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{t.historyNotice}</span>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6 gradient-subtle bg-primary max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((m, index) => (
              <MessageBubble key={index} message={m} productData={mockProductData} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-5 border-t border-border bg-card shadow-soft">
          <div className="flex gap-3">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={loading ? t.generating : t.placeholder}
              disabled={loading}
              className="flex-1 rounded-xl border-input focus-visible:ring-primary transition-smooth"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="lg"
              className="gradient-primary rounded-xl shadow-soft hover:shadow-medium transition-smooth"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
