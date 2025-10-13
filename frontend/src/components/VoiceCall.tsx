import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, PhoneOff, Mic, MicOff, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VoiceCallProps {
  onClose?: () => void;
}

export function VoiceCall({ onClose }: VoiceCallProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleStartCall = async () => {
    try {
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsCallActive(true);
      toast({
        title: "Voice Assistant Ready",
        description: "Click the microphone to start speaking",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice features",
        variant: "destructive",
      });
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsListening(false);
    toast({
      title: "Voice Session Ended",
      description: "Your voice session has been terminated",
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Unmuted" : "Muted",
      description: isMuted ? "Your microphone is now active" : "Your microphone is now muted",
    });
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak your question about artisan products",
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        toast({
          title: "You said:",
          description: transcript,
        });
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Please try again or use text chat",
          variant: "destructive",
        });
      };

      recognition.start();
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Please use text chat instead",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 shadow-warm">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Voice Assistant</h3>
        <Badge variant="secondary" className="mb-4">
          <Phone className="w-3 h-3 mr-1" />
          Browser Speech API
        </Badge>
      </div>

      {!isCallActive ? (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Uses your browser's built-in speech recognition</p>
            <p>• Works best in Chrome and Edge browsers</p>
            <p>• Requires microphone permissions</p>
          </div>

          <Button 
            onClick={handleStartCall}
            className="w-full bg-gradient-primary hover:shadow-glow"
          >
            <Phone className="w-4 h-4 mr-2" />
            Start Voice Session
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
              <Volume2 className="w-12 h-12 text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {isListening ? "Listening to your voice..." : "Ready to listen"}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={toggleMute}
              className={cn(
                "rounded-full w-14 h-14",
                isMuted && "bg-destructive text-destructive-foreground"
              )}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>

            <Button
              variant="default"
              size="lg"
              onClick={startListening}
              disabled={isMuted || isListening}
              className="rounded-full w-14 h-14 bg-gradient-primary"
            >
              <Mic className={cn("w-6 h-6", isListening && "animate-pulse")} />
            </Button>

            <Button
              variant="destructive"
              size="lg"
              onClick={handleEndCall}
              className="rounded-full w-14 h-14"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}

      {onClose && (
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="w-full mt-4"
        >
          Back to Chat
        </Button>
      )}
    </Card>
  );
}