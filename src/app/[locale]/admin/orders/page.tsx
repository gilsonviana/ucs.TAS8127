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
  status: "pending" | "fulfilled";
}

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const t = useTranslations("admin");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "fulfilled">("all");
  const [sortBy, setSortBy] = useState<"date" | "total">("date");

  function loadOrders() {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.append("status", statusFilter);
    params.append("sortBy", sortBy);

    axios
      .get<Order[]>(`/api/admin/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setOrders(r.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadOrders();
  }, [token, statusFilter, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleStatusChange(orderId: number, status: "fulfilled") {
    try {
      await axios.patch(
        `/api/admin/orders/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadOrders();
    } catch (error: any) {
      console.error("Error updating order status:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to update order status");
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-page-title font-normal text-dark mb-6">{t("orders")}</h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex gap-2 items-center">
          <label htmlFor="status-filter" className="text-sm-body font-medium text-dark">
            {t("status")}:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm-body text-dark bg-white"
          >
            <option value="all">{t("all")}</option>
            <option value="pending">{t("statusPending")}</option>
            <option value="fulfilled">{t("statusFulfilled")}</option>
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <label htmlFor="sort-by" className="text-sm-body font-medium text-dark">
            {t("sortBy")}:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm-body text-dark bg-white"
          >
            <option value="date">{t("date")}</option>
            <option value="total">{t("total")}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2 max-w-6xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-gray-200 animate-pulse h-14" aria-hidden="true" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 text-sm-body">{t("noOrders")}</p>
      ) : (
        <div className="flex flex-col gap-2 max-w-6xl">
          {orders.map((order) => (
            <OrderReceivedRow
              key={order.id}
              orderId={order.id}
              date={new Date(order.created_at).toLocaleDateString()}
              customerName={order.user_name}
              total={order.total}
              status={order.status}
              onStatusChange={(status) => handleStatusChange(order.id, status)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
