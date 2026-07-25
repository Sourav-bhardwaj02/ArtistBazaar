import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { apiService } from "@/api/api";
import { memo } from "react";

const PaymentRow = memo(({ payment }: { payment: any }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border w-full">
      <div className="min-w-0 space-y-1">
        <div className="font-medium truncate">
          Payment ID: {payment.id}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          Order: {payment.orderId}
        </div>
        <div className="text-sm text-muted-foreground">
          Date: {new Date(payment.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="ml-4 text-right space-y-1 whitespace-nowrap">
        <div className="font-semibold">
          {typeof payment.total === "number"
            ? formatPrice(payment.total)
            : payment.total}
        </div>
        <Badge variant={payment.verified ? "default" : "destructive"}>
          {payment.verified ? "Verified" : "Unverified"}
        </Badge>
      </div>
    </div>
  );
});

const formatPrice = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(v);

const Payments: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp: any = await apiService.getPayments();
      setPayments(resp?.payments || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Payments</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>All your recent payments</CardDescription>
          </CardHeader>
          {/* <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" /> Loading...
              </div>
            ) : error ? (
              <div className="text-destructive">{error}</div>
            ) : !payments.length ? (
              <div className="text-muted-foreground">No payments yet.</div>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="space-y-1">
                      <div className="font-medium">Payment ID: {p.id}</div>
                      <div className="text-sm text-muted-foreground">Order: {p.orderId}</div>
                      <div className="text-sm text-muted-foreground">Date: {new Date(p.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold">{typeof p.total === 'number' ? formatPrice(p.total) : p.total}</div>
                      <Badge variant={p.verified ? "default" : "destructive"}>
                        {p.verified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent> */}
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center gap-2 p-4 text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" /> Loading...
              </div>
            ) : error ? (
              <div className="p-4 text-destructive">{error}</div>
            ) : !payments.length ? (
              <div className="p-4 text-muted-foreground">No payments yet.</div>
            ) : (
              <div
                className="
        h-[420px]
        overflow-y-auto
        overflow-x-hidden
        px-4
        pb-4
        space-y-3
        scrollbar-gutter-stable
      "
              >
                {payments.map((p) => (
                  <PaymentRow key={p.id} payment={p} />
                ))}
              </div>
            )}
          </CardContent>

        </Card>
      </div>
    </div>
  );
};

export default Payments;
