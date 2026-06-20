"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/context/CartStore";
import axios from "axios";
import NavigationBar from "@/components/NavigationBar";
import PaymentRadio from "@/components/PaymentRadio";
import CartSummary from "@/components/CartSummary";
import Button from "@/components/Button";
import { CheckCircle } from "lucide-react";

type PaymentMethod = "credit_card" | "debit_card" | "pix" | "bank_slip";

export default function CheckoutPage() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const t = useTranslations("checkout");
  const tErr = useTranslations("errors");

  const items = useCartStore((s) => s.items);
  const cartCount = useCartStore((s) => s.totalItems());
  const total = useCartStore((s) => s.totalPrice());
  const clear = useCartStore((s) => s.clear);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  async function handlePlaceOrder() {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post<{ orderId: number; total: number }>(
        "/api/orders",
        { paymentMethod, items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      clear();
      setPlacedOrderId(res.data.orderId);
    } catch {
      setError(tErr("generic"));
    } finally {
      setLoading(false);
    }
  }

  if (placedOrderId !== null) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <NavigationBar cartCount={0} isAuthenticated={isAuthenticated} />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center">
          <CheckCircle size={64} className="text-success" />
          <h1 className="text-page-title font-normal text-dark">{t("orderPlaced")}</h1>
          <p className="text-body text-gray-600">
            {t("orderPlacedDetail", { orderId: `#${placedOrderId}` })}
          </p>
          <div className="flex gap-4 mt-4 flex-wrap justify-center">
            <Link href="/purchases" className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition text-body">
              {t("viewMyOrders")}
            </Link>
            <Link href="/" className="px-6 py-2 border border-gray-300 text-dark rounded-md hover:bg-gray-100 transition text-body">
              {t("continueShopping")}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavigationBar cartCount={cartCount} isAuthenticated={isAuthenticated} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <h1 className="text-page-title font-normal text-dark mb-6">{t("title")}</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-body text-gray-600">{t("emptyCart")}</p>
            <Link href="/" className="text-primary hover:underline text-sm-body">{t("goShopping")}</Link>
          </div>
        ) : (
            <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 flex flex-col gap-6">
                <div>
                <h2 className="text-section-title font-bold text-dark mb-4">{t("paymentMethod")}</h2>
                <PaymentRadio value={paymentMethod} onChange={setPaymentMethod} />
              </div>
            </div>
            <div className="w-full lg:w-90 shrink-0">
              <CartSummary total={total} onCheckout={handlePlaceOrder} disabled={loading} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
