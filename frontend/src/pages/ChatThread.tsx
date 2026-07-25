import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiService } from "@/api/api";
import { getSocket } from "@/lib/socket";

interface Msg {
  _id: string;
  text: string;
  createdAt: string;
  sender: { _id: string; name: string; avatar?: string };
  recipient: { _id: string; name: string; avatar?: string };
}

export default function ChatThread() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const endRef = useRef<HTMLDivElement | null>(null);

  const meId = useMemo(() => {
    try {
      const raw = localStorage.getItem('user-data');
      if (!raw) return '';
      const u = JSON.parse(raw);
      return u?.id || u?._id || '';
    } catch { return ''; }
  }, []);

  const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: 'smooth' });

  const loadMessages = async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const res: any = await apiService.getMessages(conversationId, { limit: '100' });
      setMessages(res?.items || []);
      await apiService.markRead(conversationId);
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  // Socket.IO realtime updates
  useEffect(() => {
    const socket = getSocket();
    if (!conversationId) return;
    socket.emit('conversation:join', conversationId);
    const handler = (payload: any) => {
      if (payload?.conversationId !== conversationId) return;
      setMessages((prev) => [...prev, payload.message]);
      setTimeout(scrollToBottom, 50);
    };
    socket.on('message:new', handler);
    return () => {
      socket.off('message:new', handler);
      socket.emit('conversation:leave', conversationId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    let t: any;
    const tick = async () => {
      if (document.hidden) return; // pause when tab hidden
      await loadMessages();
    };
    tick();
    t = setInterval(tick, 8000);
    const vis = () => { if (!document.hidden) tick(); };
    document.addEventListener('visibilitychange', vis);
    return () => {
      clearInterval(t);
      document.removeEventListener('visibilitychange', vis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const onSend = async () => {
    if (!input.trim() || !conversationId) return;
    setSending(true);
    try {
      await apiService.sendMessage(conversationId, input.trim());
      setInput("");
      await loadMessages();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto border rounded-md p-3 bg-background">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div key={m._id} className={`flex ${m.sender?._id === meId ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-3 py-2 rounded-md text-sm ${m.sender?._id === meId ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <div>{m.text}</div>
                        <div className="text-[10px] opacity-70 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" onKeyDown={(e) => { if (e.key === 'Enter') onSend(); }} />
              <Button onClick={onSend} disabled={sending || !input.trim()}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
