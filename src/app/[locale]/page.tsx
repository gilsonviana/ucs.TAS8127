"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/context/CartStore";
import { useProducts, useCategories } from "@/hooks/useCatalog";
import NavigationBar from "@/components/NavigationBar";
import CategoryNavBar from "@/components/CategoryNavBar";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const t = useTranslations("home");
  const cartCount = useCartStore((s) => s.totalItems());
  const addItem = useCartStore((s) => s.addItem);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const categories = useCategories();
  const { products, loading } = useProducts(search, selectedCategory);

  function handleSearch(query: string) {
    setSearch(query);
  }

  function handleAddToCart(productId: number) {
    if (!isAuthenticated) { router.push("/login"); return; }
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.image_url ?? undefined });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar cartCount={cartCount} isAuthenticated={isAuthenticated} onSearch={handleSearch} />

      {/* Hero */}
      <div className="w-full bg-gradient-to-r from-void to-dark flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <h1 className="text-page-title text-white font-normal mb-3">{t("title")}</h1>
          <p className="text-body text-gray-400 mb-6">{t("subtitle")}</p>
          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <Link href="/signup" className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition text-body font-bold">
                {t("getStarted")}
              </Link>
              <Link href="/login" className="px-6 py-2 border border-white/20 text-white rounded-md hover:bg-white/10 transition text-body">
                Login
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <button onClick={logout} className="text-sm-body text-gray-400 hover:text-error transition">
              Logout
            </button>
          )}
        </div>
      </div>

      <CategoryNavBar categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white/10 animate-pulse h-64" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400 py-16">{t("noProductsFound")}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} imageUrl={product.image_url ?? undefined} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
