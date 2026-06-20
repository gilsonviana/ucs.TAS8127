"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/context/CartStore";
import { useCategories } from "@/hooks/useCatalog";
import NavigationBar from "@/components/NavigationBar";
import CategoryNavBar from "@/components/CategoryNavBar";
import ImageCard from "@/components/ImageCard";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const cartCount = useCartStore((s) => s.totalItems());
  const categories = useCategories(); // Used for CategoryNavBar

  function handleSearchSubmit(query: string) {
    if (query.trim()) {
      router.push(`/categories?search=${encodeURIComponent(query)}`);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavigationBar cartCount={cartCount} isAuthenticated={isAuthenticated} onSearchSubmit={handleSearchSubmit} />

      {/* Hero */}
      <div className="w-full h-80 relative">
        <Image src="/home-hero.png" alt="Hero" fill className="object-cover" />
      </div>

      <CategoryNavBar categories={categories} navigateToCategories={true} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <h2 className="text-section-title font-bold text-dark mb-6">Confira nossas produtos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/categories?category=8">
            <ImageCard src="/gabinete-card.png" alt="Gabinete" title="Gabinetes" />
          </Link>
          <Link href="/categories?category=6">
            <ImageCard src="/headphone-card.png" alt="Headphone" title="Fones de ouvido" />
          </Link>
          <Link href="/categories?category=3">
            <ImageCard src="/memoria-card.png" alt="Memória" title="Memórias" />
          </Link>
          <Link href="/categories?category=5">
            <ImageCard src="/placa-video-card.png" alt="Placa de Vídeo" title="Placas de Vídeo" />
          </Link>
        </div>
      </main>
    </div>
  );
}
