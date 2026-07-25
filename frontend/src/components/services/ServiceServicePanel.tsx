import { useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSocket } from "@/lib/socket";
import { apiService } from "@/api/api";

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

interface Msg {
  _id: string;
  text: string;
  createdAt: string;
  sender: { _id: string; name: string; avatar?: string };
  recipient: { _id: string; name: string; avatar?: string };
}

export default function ServiceServicePanel() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Service Panel</h1>
        <p className="text-sm text-muted-foreground">Tech support chat, customer and product monitoring</p>
      </div>
      <Tabs defaultValue="chat" className="w-full">
        <TabsList>
          <TabsTrigger value="chat">Tech Support Chat</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <TechSupportChat />
        </TabsContent>
        <TabsContent value="customers">
          <CustomersMonitor />
        </TabsContent>
        <TabsContent value="products">
          <ProductsMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TechSupportChat() {
  const [items, setItems] = useState<ConversationItem[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
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

  const loadConversations = async () => {
    setLoadingConvs(true);
    try {
      const res: any = await apiService.getConversations();
      setItems(res?.conversations || []);
    } catch { /* noop */ }
    finally { setLoadingConvs(false); }
  };

  const loadMessages = async (conversationId: string) => {
    setLoadingMsgs(true);
    try {
      const res: any = await apiService.getMessages(conversationId, { limit: '100' });
      setMessages(res?.items || []);
      await apiService.markRead(conversationId);
    } catch { /* noop */ }
    finally { setLoadingMsgs(false); setTimeout(scrollToBottom, 50); }
  };

  useEffect(() => {
    loadConversations();
    const t = setInterval(loadConversations, 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
  }, [activeId]);

  // Socket realtime
  useEffect(() => {
    const socket = getSocket();
    if (!activeId) return;
    socket.emit('conversation:join', activeId);
    const handler = (payload: any) => {
      if (payload?.conversationId !== activeId) return;
      setMessages((prev) => [...prev, payload.message]);
      setTimeout(scrollToBottom, 50);
    };
    socket.on('message:new', handler);
    return () => {
      socket.off('message:new', handler);
      socket.emit('conversation:leave', activeId);
    };
  }, [activeId]);

  const onSend = async () => {
    if (!input.trim() || !activeId) return;
    setSending(true);
    try {
      const text = input.trim();
      const tmp: Msg = {
        _id: `tmp-${Date.now()}`,
        text,
        createdAt: new Date().toISOString(),
        sender: { _id: meId, name: "You" },
        recipient: { _id: "", name: "" },
      } as any;
      setMessages((prev) => [...prev, tmp]);
      setInput("");
      await apiService.sendMessage(activeId, text);
      await loadMessages(activeId);
      await loadConversations();
    } finally { setSending(false); }
  };

  const filtered = items.filter((c) => {
    if (!q) return true;
    const other = c.participants.find((p) => p._id !== meId);
    const hay = `${other?.name || ""} ${other?.email || ""}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Input placeholder="Search name/email" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button variant="outline" onClick={loadConversations} disabled={loadingConvs}>Refresh</Button>
          </div>
          <div className="divide-y max-h-[28rem] overflow-y-auto">
            {loadingConvs ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded-md animate-pulse" />
                ))}
              </div>
            ) : filtered.length ? filtered.map((c) => {
              const other = c.participants.find((p) => p._id !== meId) || c.participants[0];
              const isActive = activeId === c.id;
              return (
                <div
                  key={c.id}
                  className={`py-3 px-2 cursor-pointer hover:bg-accent/40 rounded-md flex items-center justify-between ${isActive ? 'bg-accent/50' : ''}`}
                  onClick={() => setActiveId(c.id)}
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
                      <div className="font-medium">{other?.name || other?.email || 'User'}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{c.lastMessage || '(no messages)'}</div>
                    </div>
                  </div>
                  <div className="text-right min-w-[4rem]">
                    {c.unread > 0 ? <Badge variant="secondary">{c.unread}</Badge> : null}
                    <div className="text-[10px] text-muted-foreground">{new Date(c.lastMessageAt).toLocaleString()}</div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-sm text-muted-foreground py-6">No conversations.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Responses Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[28rem] overflow-y-auto border rounded-md p-3 bg-background">
            {activeId ? (
              loadingMsgs ? (
                <div className="text-sm text-muted-foreground">Loading messages...</div>
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
              )
            ) : (
              <div className="text-sm text-muted-foreground">Select a conversation to view messages.</div>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a response" onKeyDown={(e) => { if (e.key === 'Enter') onSend(); }} disabled={!activeId} />
            <Button onClick={onSend} disabled={sending || !input.trim() || !activeId}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CustomersMonitor() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res: any = await apiService.getCustomers();
      setData(res?.customers || []);
    } catch { /* noop */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, []);

  const filtered = data.filter((c) => {
    if (!q) return true;
    const hay = JSON.stringify(c).toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Customers</CardTitle>
          <div className="flex gap-2">
            <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button variant="outline" onClick={load} disabled={loading}>Refresh</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        ) : filtered.length ? (
          <div className="grid md:grid-cols-2 gap-3">
            {filtered.map((c: any) => (
              <div key={c._id || c.id} className="border rounded-md p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.name || c.email || 'Customer'}</div>
                  <div className="text-xs text-muted-foreground">{c.email}</div>
                </div>
                <Badge variant="secondary">{c.role || 'Customer'}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No customers to show.</div>
        )}
      </CardContent>
    </Card>
  );
}

function ProductsMonitor() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res: any = await apiService.getProducts({ limit: '50', sort: 'new' });
      setItems(res?.products || res?.items || res || []);
    } catch { /* noop */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, []);

  const filtered = items.filter((p) => {
    if (!q) return true;
    const hay = `${p.name || p.title || ''} ${p.description || ''}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Products</CardTitle>
          <div className="flex gap-2">
            <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button variant="outline" onClick={load} disabled={loading}>Refresh</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        ) : filtered.length ? (
          <div className="grid md:grid-cols-2 gap-3">
            {filtered.map((p: any) => (
              <div key={p._id || p.id} className="border rounded-md p-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-muted rounded overflow-hidden">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium line-clamp-1">{p.name || p.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{p.description}</div>
                  </div>
                  <div className="text-right min-w-[5rem]">
                    <div className="font-semibold">₹{p.price || p.amount || 0}</div>
                    {typeof p.stock !== 'undefined' ? (
                      <div className="text-xs text-muted-foreground">Stock: {p.stock}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No products to show.</div>
        )}
      </CardContent>
    </Card>
  );
}
