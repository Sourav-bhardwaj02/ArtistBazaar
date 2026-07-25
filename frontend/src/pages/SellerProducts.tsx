import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, RefreshCw, Trash2 } from 'lucide-react';

interface ProductItem {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  stock?: number;
  images?: string[];
  tags?: string[];
  createdAt?: string;
}

export default function SellerProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ProductItem[]>([]);
  const [editing, setEditing] = useState<ProductItem | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    tags: '',
    imageUrls: '',
  });

  const load = async () => {
    try {
      setLoading(true);
      const res = await apiService.getSellerProducts() as any;
      setItems(res.items || []);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to load products', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    const ok = window.confirm('Are you sure you want to delete this product? This action cannot be undone.');
    if (!ok) return;
    try {
      setLoading(true);
      await apiService.deleteProduct(id);
      toast({ title: 'Product deleted' });
      setEditing(null);
      await load();
    } catch (e: any) {
      toast({ title: 'Failed to delete', description: e.message || 'Please try again', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openEdit = (p: ProductItem) => {
    setEditing(p);
    setForm({
      name: p.name || '',
      description: p.description || '',
      category: p.category || '',
      price: String(p.price ?? ''),
      stock: String(p.stock ?? ''),
      tags: (p.tags || []).join(', '),
      imageUrls: (p.images || []).join(', '),
    });
  };

  const save = async () => {
    if (!editing) return;
    try {
      setLoading(true);
      const payload: any = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: form.stock ? Number(form.stock) : 0,
        tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      const urls = form.imageUrls.split(',').map(u => u.trim()).filter(Boolean);
      const valid = urls.filter(u => /^https?:\/\//i.test(u));
      if (valid.length) payload.images = valid;

      await apiService.updateProduct(editing._id, payload);
      toast({ title: 'Product updated' });
      setEditing(null);
      await load();
    } catch (e: any) {
      toast({ title: 'Failed to update', description: e.message || 'Please try again', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Products</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => navigate(`/seller/${id}/home`)}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-muted-foreground">No products yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(p => (
            <Card key={p._id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="truncate">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteItem(p._id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🏺</span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">{p.description}</div>
                <div className="text-sm">₹{p.price}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} />
              </div>
              <div>
                <Label>Price</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div>
                <Label>Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm(f => ({ ...f, stock: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label>Tags (comma-separated)</Label>
              <Input value={form.tags} onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
            <div>
              <Label>Image URLs (comma-separated)</Label>
              <Input placeholder="https://... , https://..." value={form.imageUrls} onChange={(e) => setForm(f => ({ ...f, imageUrls: e.target.value }))} />
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="destructive" onClick={() => editing && deleteItem(editing._id)} disabled={loading}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
