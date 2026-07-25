import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { apiService } from "@/api/api";
import { useNavigate, useParams } from "react-router-dom";

interface Participant {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface ConversationItem {
  id: string;
  participants: Participant[];
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

export default function SellerChats() {
  const [items, setItems] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { id: sellerId } = useParams();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await apiService.getConversations();
      const list: ConversationItem[] = res?.conversations || [];
      setItems(list);
    } catch (e: any) {
      setError(e?.message || "Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const meId = (() => {
    try {
      const raw = localStorage.getItem('user-data');
      if (!raw) return '';
      const u = JSON.parse(raw);
      return u?.id || u?._id || '';
    } catch {
      return '';
    }
  })();

  const filtered = items.filter((c) => {
    if (!q) return true;
    const other = c.participants.find((p) => p._id !== meId);
    const hay = `${other?.name || ""} ${other?.email || ""}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Chats</h1>
        <Button variant="outline" onClick={load} disabled={loading}>Refresh</Button>
      </div>
      <div className="flex gap-2 mb-2">
        <Input placeholder="Search chats by name/email" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {error ? (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">{error}</div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          ) : filtered.length ? (
            <div className="divide-y">
              {filtered.map((c) => {
                const other = c.participants.find((p) => p._id !== meId) || c.participants[0];
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between py-3 cursor-pointer hover:bg-accent/40 px-2 rounded-md"
                    onClick={() => navigate(`/seller/${sellerId}/chats/${c.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                        {other?.avatar ? (
                          <img src={other.avatar} alt={other.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">👤</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{other?.name || other?.email || "User"}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{c.lastMessage || "(no messages)"}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {c.unread > 0 ? <Badge variant="secondary">{c.unread}</Badge> : null}
                      <div className="text-xs text-muted-foreground">{new Date(c.lastMessageAt).toLocaleString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No conversations yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
