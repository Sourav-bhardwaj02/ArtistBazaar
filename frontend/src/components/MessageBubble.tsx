import { Fragment, useState, useEffect } from "react";
import { ChatProductCard } from "./ChatProductCard";
import { getAllCatalogProducts } from "@/lib/ragContext";
import { Product } from "@/lib/productData";
import { renderCleanFormattedText } from "@/lib/formatText";

interface Message {
  role: "user" | "model";
  content: string;
}

interface MessageBubbleProps {
  message: Message;
  productData?: Product[];
}

export const MessageBubble = ({ message, productData }: MessageBubbleProps) => {
  const isUser = message.role === "user";
  const [catalog, setCatalog] = useState<Product[]>(productData || []);

  useEffect(() => {
    if (!productData || productData.length === 0) {
      getAllCatalogProducts().then(setCatalog).catch(console.error);
    } else {
      setCatalog(productData);
    }
  }, [productData]);

  // Regex to find Markdown links for product cards: [View Product: Product Name](product URL)
  const linkRegex = /\[View Product: (.*?)\]\((.*?)\)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  let match;
  while ((match = linkRegex.exec(message.content)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      const textSegment = message.content.substring(lastIndex, match.index);
      parts.push(
        <div key={`text-${lastIndex}`}>
          {renderCleanFormattedText(textSegment)}
        </div>
      );
    }

    const productName = match[1];
    const productUrl = match[2];

    // Match by name or ID extracted from URL
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

  // Add remaining text
  if (lastIndex < message.content.length) {
    const textSegment = message.content.substring(lastIndex);
    parts.push(
      <div key={`text-${lastIndex}`}>
        {renderCleanFormattedText(textSegment)}
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } animate-in fade-in slide-in-from-bottom-2 duration-300 my-2`}
    >
      <div
        className={`max-w-[90%] sm:max-w-[85%] p-4 rounded-2xl shadow-soft space-y-2 ${
          isUser
            ? "gradient-primary text-primary-foreground rounded-br-sm"
            : "bg-card text-card-foreground border border-border rounded-tl-sm"
        }`}
      >
        {parts.map((part, index) => (
          <Fragment key={index}>{part}</Fragment>
        ))}
      </div>
    </div>
  );
};
