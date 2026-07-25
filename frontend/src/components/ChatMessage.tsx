import { Fragment, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChatProductCard } from "./ChatProductCard";
import { getAllCatalogProducts } from "@/lib/ragContext";
import { Product } from "@/lib/productData";
import { renderCleanFormattedText } from "@/lib/formatText";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatMessage({ message, isBot, timestamp }: ChatMessageProps) {
  const [catalog, setCatalog] = useState<Product[]>([]);

  useEffect(() => {
    if (isBot && message.includes("[View Product:")) {
      getAllCatalogProducts().then(setCatalog).catch(console.error);
    }
  }, [isBot, message]);

  // Parse [View Product: Product Name](product URL) links
  const linkRegex = /\[View Product: (.*?)\]\((.*?)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  let match;
  while ((match = linkRegex.exec(message)) !== null) {
    if (match.index > lastIndex) {
      const textSegment = message.substring(lastIndex, match.index);
      parts.push(
        <div key={`text-${lastIndex}`}>
          {renderCleanFormattedText(textSegment)}
        </div>
      );
    }

    const productName = match[1];
    const productUrl = match[2];

    const product = catalog.find(
      (p) =>
        p.name.toLowerCase() === productName.toLowerCase() ||
        (p.id && productUrl.includes(p.id))
    );

    parts.push(
      <ChatProductCard
        key={`${productName}-${lastIndex}`}
        product={product}
        productName={productName}
        productUrl={productUrl}
      />
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < message.length) {
    const textSegment = message.substring(lastIndex);
    parts.push(
      <div key={`text-${lastIndex}`}>
        {renderCleanFormattedText(textSegment)}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-xl max-w-[90%] sm:max-w-[85%] my-2 shadow-sm",
        isBot
          ? "bg-muted text-foreground self-start border border-border"
          : "bg-orange-500 text-white self-end ml-auto"
      )}
      role="group"
      aria-label={isBot ? "Received message" : "Sent message"}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
          isBot
            ? "bg-orange-500 text-white"
            : "bg-white/20 text-white"
        )}
      >
        {isBot ? "🤖" : "👤"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-xs opacity-90">
            {isBot ? "Artisan Assistant" : "You"}
          </span>
          <span className="text-[10px] opacity-70">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={cn("text-sm space-y-1", isBot ? "text-foreground" : "text-white")}>
          {parts.map((part, idx) => (
            <Fragment key={idx}>{part}</Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}