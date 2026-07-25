import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const ChatButton = ({ isOpen, onClick }: ChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="w-16 h-16 rounded-full shadow-glow gradient-primary hover:scale-110 transition-smooth border-0"
      aria-label={isOpen ? "Close AURA AI Chat" : "Open AURA AI Chat"}
    >
      {isOpen ? (
        <X className="h-7 w-7" />
      ) : (
        <MessageCircle className="h-7 w-7" />
      )}
    </Button>
  );
};
