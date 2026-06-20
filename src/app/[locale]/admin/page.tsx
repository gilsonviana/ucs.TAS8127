"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, Tag, Package, Users } from "lucide-react";

interface Stats {
  orders: number;
  products: number;
  categories: number;
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats>({ orders: 0, products: 0, categories: 0 });

  useEffect(() => {
    Promise.all([
      axios.get<{ count: number }>("/api/admin/stats/orders", {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => ({ data: { count: 0 } })),
      axios.get<{ count: number }>("/api/admin/stats/products", {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => ({ data: { count: 0 } })),
      axios.get<{ count: number }>("/api/admin/stats/categories", {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => ({ data: { count: 0 } })),
    ]).then(([orders, products, categories]) => {
      setStats({
        orders: orders.data.count,
        products: products.data.count,
        categories: categories.data.count,
      });
    });
  }, [token]);

  const cards = [
    { label: "Pedidos", value: stats.orders, icon: ShoppingBag, color: "text-primary" },
    { label: "Produtos", value: stats.products, icon: Package, color: "text-success" },
    { label: "Categories", value: stats.categories, icon: Tag, color: "text-warning" },
  ];

  return (
    <main className="p-8">
      <h1 className="text-page-title font-normal text-dark mb-8">Painel de controle</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-gray-100 rounded-2xl p-6 flex items-center gap-4 shadow"
            >
              <Icon size={36} className={card.color} />
              <div>
                <p className="text-xs-body text-gray-600">{card.label}</p>
                <p className="text-page-title font-bold text-dark">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
