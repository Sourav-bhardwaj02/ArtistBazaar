import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatMessage({ message, isBot, timestamp }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg",
      isBot ? "bg-card" : "bg-primary/10 ml-8"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
        isBot 
          ? "bg-gradient-primary text-primary-foreground" 
          : "bg-secondary text-secondary-foreground"
      )}>
        {isBot ? "🤖" : "👤"}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {isBot ? "Artisan Assistant" : "You"}
          </span>
          <span className="text-xs text-muted-foreground">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-foreground">{message}</p>
      </div>
    </div>
  );
}