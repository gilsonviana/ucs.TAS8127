"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import OrderReceivedRow from "@/components/OrderReceivedRow";

interface Order {
  id: number;
  total: number;
  created_at: string;
  user_name: string;
}

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const t = useTranslations("admin");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Order[]>("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setOrders(r.data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <main className="p-8">
      <h1 className="text-page-title font-normal text-dark mb-6">{t("orders")}</h1>

      {loading ? (
        <div className="flex flex-col gap-2 max-w-3xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-gray-200 animate-pulse h-14" aria-hidden="true" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 text-sm-body">{t("noOrders")}</p>
      ) : (
        <div className="flex flex-col gap-2 max-w-3xl">
          {orders.map((order) => (
            <OrderReceivedRow
              key={order.id}
              orderId={order.id}
              date={new Date(order.created_at).toLocaleDateString()}
              customerName={order.user_name}
              total={order.total}
            />
          ))}
        </div>
      )}
    </main>
  );
}
