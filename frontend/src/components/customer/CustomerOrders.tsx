import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Minus, Plus, Trash2, ShoppingCart, RefreshCw, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formatPrice = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);

export default function CustomerOrders() {
  const { id } = useParams();
  const { toast } = useToast();
  const { cart, updateCartQuantity, removeFromCart, isLoading, error, refreshCart } = useCart();

  const total = useMemo(() => cart?.reduce((s, i) => s + i.priceSnapshot * i.quantity, 0) || 0, [cart]);

  const inc = async (pid: string, qty: number) => {
    try { await updateCartQuantity(pid, qty + 1); } 
    catch (e: any) { toast({ title: 'Error', description: e.message || 'Failed to update', variant: 'destructive' }); }
  };
  const dec = async (pid: string, qty: number) => {
    if (qty <= 1) return; 
    try { await updateCartQuantity(pid, qty - 1); } 
    catch (e: any) { toast({ title: 'Error', description: e.message || 'Failed to update', variant: 'destructive' }); }
  };
  const remove = async (pid: string) => {
    try { await removeFromCart(pid); toast({ title: 'Removed from cart' }); }
    catch (e: any) { toast({ title: 'Error', description: e.message || 'Failed to remove', variant: 'destructive' }); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6" />
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/customer/${id}/home`}><ArrowLeft className="w-4 h-4 mr-2"/> Back</Link>
          </Button>
          <Button variant="outline" onClick={refreshCart} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive"><AlertDescription>{String(error)}</AlertDescription></Alert>
      ) : null}

      {!cart?.length ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Your cart is empty.
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product?.name || 'Product'} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">🏺</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.product?.name || 'Product'}</div>
                    <div className="text-sm text-muted-foreground">{formatPrice(item.priceSnapshot)} each</div>
                    <div className="text-sm text-muted-foreground">Subtotal: {formatPrice(item.priceSnapshot * item.quantity)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => dec(item.productId, item.quantity)} disabled={item.quantity<=1 || isLoading}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => inc(item.productId, item.quantity)} disabled={isLoading}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(item.productId)} disabled={isLoading}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm"><span>Items</span><span>{cart.reduce((s,i)=>s+i.quantity,0)}</span></div>
                <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>{formatPrice(total)}</span></div>
                <Button className="w-full" disabled={isLoading}>Proceed to Checkout</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
