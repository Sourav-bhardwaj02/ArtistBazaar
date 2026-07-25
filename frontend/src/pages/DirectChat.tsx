import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "@/api/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const DirectChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const start = async () => {
      try {
        // Require login
        const userRaw = localStorage.getItem('user-data');
        if (!userRaw) {
          navigate('/login');
          return;
        }

        if (!id) {
          setError('Invalid seller');
          setLoading(false);
          return;
        }
        const res: any = await apiService.startConversation(String(id));
        const convId = res?.id;
        if (convId) {
          navigate(`/chat/thread/${convId}`);
        } else {
          setError('Could not start conversation');
          setLoading(false);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to start chat');
        setLoading(false);
      }
    };
    start();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-muted-foreground">Starting chat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="text-center space-y-3">
        <div className="text-red-600">{error || 'Unable to start chat'}</div>
        <Button variant="outline" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
      </div>
    </div>
  );
};

export default DirectChat;