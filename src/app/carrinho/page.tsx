"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/context/CartStore";
import NavigationBar from "@/components/NavigationBar";
import CartListItem from "@/components/CartListItem";
import CartSummary from "@/components/CartSummary";

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const t = useTranslations("cart");

  const items = useCartStore((s) => s.items);
  const cartCount = useCartStore((s) => s.totalItems());
  const total = useCartStore((s) => s.totalPrice());
  const removeItem = useCartStore((s) => s.removeItem);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavigationBar cartCount={cartCount} isAuthenticated={isAuthenticated} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <h1 className="text-page-title font-normal text-dark mb-6">{t("title")}</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-body text-gray-600">{t("empty")}</p>
            <Link href="/" className="text-primary hover:underline text-sm-body">
              {t("continueShopping")}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 flex flex-col gap-3 w-full">
              {items.map((item) => (
                <CartListItem
                  key={item.productId}
                  productId={item.productId}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  imageUrl={item.imageUrl}
                  onRemove={removeItem}
                  onIncrement={increment}
                  onDecrement={decrement}
                />
              ))}
            </div>
              <div className="w-full lg:w-90 shrink-0">
              <CartSummary total={total} onCheckout={() => router.push("/checkout")} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
