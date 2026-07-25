import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/context/CartContext/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { apiService } from "@/api/api";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const formatPrice = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(v);

async function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return true;
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener('load', () => {
        // Poll for global to appear (Safari sometimes delays global export)
        const started = Date.now();
        const tick = () => {
          if (window.Razorpay) return resolve(true);
          if (Date.now() - started > 15000) return resolve(false);
          setTimeout(tick, 100);
        };
        tick();
      });
      existing.addEventListener('error', () => resolve(false));
      // Safety timeout
      setTimeout(() => resolve(!!window.Razorpay), 15000);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      const started = Date.now();
      const tick = () => {
        if (window.Razorpay) return resolve(true);
        if (Date.now() - started > 15000) return resolve(false);
        setTimeout(tick, 100);
      };
      tick();
    };
    script.onerror = () => resolve(false);
    (document.head || document.body).appendChild(script);
    // Fallback timeout
    setTimeout(() => resolve(!!window.Razorpay), 15000);
  });
}

const Checkout: React.FC = () => {
  const { cart, isLoading, refreshCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paying, setPaying] = useState(false);

  // Guard refreshCart so it runs only once (React StrictMode mounts twice in dev)
  const didRefresh = useRef(false);
  useEffect(() => {
    if (didRefresh.current) return;
    didRefresh.current = true;
    refreshCart().catch(() => { });
  }, [refreshCart]);

  // const total = useMemo(() => getCartTotal(), [getCartTotal, cart?.length, cart?.[0]?.quantity, cart?.[0]?.priceSnapshot]);
  const total = useMemo(() => getCartTotal(), [getCartTotal, cart]);
  const handlePay = useCallback(async () => {
    try {
      setPaying(true);
      let ok = await loadRazorpay();
      if (!ok) {
        // quick retry once
        await new Promise(res => setTimeout(res, 600));
        ok = await loadRazorpay();
      }
      if (!ok) {
        toast({ title: "Payment Error", description: "Failed to load Razorpay SDK", variant: "destructive" });
        return;
      }

      // Create order on backend (also returns public key). If it fails, bail out.
      let orderId: string | undefined;
      let keyFromServer: string | undefined;
      let createResp: any;
      try {
        createResp = await apiService.createPaymentOrder(total, "INR");
        // Expected resp: { order: { id, amount, currency }, key }
        orderId = createResp?.order?.id;
        keyFromServer = createResp?.key;
      } catch {
        toast({ title: "Payment Error", description: "Failed to create order", variant: "destructive" });
        return;
      }
      if (!keyFromServer) {
        toast({ title: "Payment Error", description: "Missing payment key", variant: "destructive" });
        return;
      }

      if (!window.Razorpay) {
        toast({ title: "Payment Error", description: "Payment SDK unavailable. Please retry.", variant: "destructive" });
        return;
      }

      const options: any = {
        key: keyFromServer,
        amount: createResp?.order?.amount ?? Math.round(total * 100),
        currency: "INR",
        name: "ArtistBazaar",
        description: "Order Payment",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const payload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              total,
              cartSnapshot: cart || [],
            };
            // await apiService.verifyPayment(payload);
            // toast({ title: "Payment successful", description: `Payment ID: ${response.razorpay_payment_id}` });
            // navigate("/payments");
            await apiService.verifyPayment(payload);
            await refreshCart();  // Sync cart after success
            navigate("/payments");
          } catch (e: any) {
            toast({ title: "Verification failed", description: e?.message || "Could not verify payment", variant: "destructive" });
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: { color: "#2563eb" },
      };


      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp: any) {
        toast({ title: "Payment failed", description: resp?.error?.description || "Please try again", variant: "destructive" });
      });
      rzp.on("modal.closed", function () {
        toast({ title: "Payment cancelled", description: "You closed the payment window.", variant: "default" });
      });
      rzp.open();
    } catch (err: any) {
      toast({ title: "Payment error", description: err?.message || "Something went wrong", variant: "destructive" });
    } finally {
      setPaying(false);
    }
  }, [navigate, toast, total]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your items before payment</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center gap-2 p-4 text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Loading cart...
                </div>
              ) : !cart?.length ? (
                <div className="p-4 text-muted-foreground">Your cart is empty.</div>
              ) : (
                <div
                  className="
        h-[420px]
        overflow-y-auto
        overflow-x-hidden
        px-4
        pb-4
        space-y-4
        scrollbar-gutter-stable
      "
                >
                  {cart.map((item, index) => (
                    <div
                      key={`${item.productId ?? item.product?._id ?? 'item'}-${item.priceSnapshot}-${item.quantity}-${index}`}
                      className="
            flex
            items-center
            justify-between
            border
            rounded-lg
            p-3
            bg-white
            w-full
          "
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">
                          {item.product?.name || "Product"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Price: {formatPrice(item.priceSnapshot)}
                        </div>
                      </div>

                      <div className="ml-4 text-right font-semibold whitespace-nowrap">
                        {formatPrice(item.priceSnapshot * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>Complete your order securely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <Button className="w-full" size="lg" onClick={handlePay} disabled={paying || isLoading || !cart?.length}>
                {paying ? (
                  <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  "Pay with Razorpay"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
