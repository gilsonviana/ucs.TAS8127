"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/context/CartStore";
import { useProducts, useCategories } from "@/hooks/useCatalog";
import NavigationBar from "@/components/NavigationBar";
import CategoryNavBar from "@/components/CategoryNavBar";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
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
    <div className="flex flex-col min-h-screen bg-white">
      <NavigationBar cartCount={cartCount} isAuthenticated={isAuthenticated} onSearch={handleSearch} />

      {/* Hero */}
      <div className="w-full h-80 relative">
        <Image src="/home-hero.png" alt="Hero" fill className="object-cover" />
      </div>

      <CategoryNavBar categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-200 animate-pulse h-64" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600 py-16">{t("noProductsFound")}</p>
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
