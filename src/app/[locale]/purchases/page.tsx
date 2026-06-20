"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/context/CartStore";
import axios from "axios";
import NavigationBar from "@/components/NavigationBar";
import OrderGroupItem from "@/components/OrderGroupItem";

interface OrderItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  name: string;
  image_url: string | null;
}

interface Order {
  id: number;
  payment_method: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function PurchasesPage() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const t = useTranslations("orders");
  const cartCount = useCartStore((s) => s.totalItems());
  const addItem = useCartStore((s) => s.addItem);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const handleBuyAgain = (order: Order) => {
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          productId: item.product_id,
          name: item.name,
          price: item.unit_price,
          imageUrl: item.image_url ?? undefined,
        });
      }
    });
    router.push("/cart");
  };

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    axios
      .get<Order[]>("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setOrders(r.data))
      .finally(() => setLoading(false));
  }, [isAuthenticated, token, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavigationBar cartCount={cartCount} isAuthenticated={isAuthenticated} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <h1 className="text-page-title font-normal text-dark mb-6">{t("title")}</h1>

        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-200 animate-pulse h-40" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-body text-gray-600">{t("empty")}</p>
            <Link href="/" className="text-primary hover:underline text-sm-body">{t("startShopping")}</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <OrderGroupItem
                key={order.id}
                orderId={order.id}
                date={new Date(order.created_at).toLocaleDateString()}
                total={order.total}
                items={order.items.map((i) => ({
                  productId: i.product_id,
                  name: i.name,
                  quantity: i.quantity,
                  unitPrice: i.unit_price,
                  imageUrl: i.image_url ?? undefined,
                }))}
                showProductPrices={false}
                onBuyAgain={() => handleBuyAgain(order)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
