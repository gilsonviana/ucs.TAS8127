"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/context/CartStore";
import { useProducts, useCategories } from "@/hooks/useCatalog";
import NavigationBar from "@/components/NavigationBar";
import CategorySidebar from "@/components/CategorySidebar";
import CategoryNavBar from "@/components/CategoryNavBar";
import ProductCard from "@/components/ProductCard";

function CategoriesContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const t = useTranslations("categories");
  const searchParams = useSearchParams();
  const cartCount = useCartStore((s) => s.totalItems());
  const addItem = useCartStore((s) => s.addItem);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get("category") ? parseInt(searchParams.get("category")!) : null
  );

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    const categoryParam = searchParams.get("category");
    setSelectedCategory(categoryParam ? parseInt(categoryParam) : null);
  }, [searchParams]);

  const categories = useCategories();
  const { products, loading } = useProducts(search, selectedCategory);

  function handleAddToCart(productId: number) {
    if (!isAuthenticated) { router.push("/login"); return; }
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.image_url ?? "" });
  }

  const heading = selectedCategory
    ? (categories.find((c) => c.id === selectedCategory)?.name ?? t("title"))
    : t("allProducts");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavigationBar cartCount={cartCount} isAuthenticated={isAuthenticated} onSearch={setSearch} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <div className="hidden md:block">
          <CategorySidebar categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>
        {/* Mobile: horizontal scroll nav */}
        <div className="md:hidden">
          <CategoryNavBar categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <main className="flex-1 min-w-0">
          <h1 className="text-section-title font-bold text-dark mb-6">{heading}</h1>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-gray-200 animate-pulse h-64" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-600 py-16 text-center">{t("noProductsFound")}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} imageUrl={product.image_url ?? undefined} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense>
      <CategoriesContent />
    </Suspense>
  );
}
