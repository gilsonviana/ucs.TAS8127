"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/context/CartStore";
import { useCategories } from "@/hooks/useCatalog";
import NavigationBar from "@/components/NavigationBar";
import CategoryNavBar from "@/components/CategoryNavBar";
import ImageCard from "@/components/ImageCard";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const cartCount = useCartStore((s) => s.totalItems());
  const categories = useCategories();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavigationBar cartCount={cartCount} isAuthenticated={isAuthenticated} />

      {/* Hero */}
      <div className="w-full h-80 relative">
        <Image src="/home-hero.png" alt="Hero" fill className="object-cover" />
      </div>

      <CategoryNavBar categories={categories} navigateToCategories={true} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <h2 className="text-section-title font-bold text-dark mb-6">Confira nossas produtos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(() => {
            const casesId = categories.find((c) => c.name === "Cases")?.id;
            return casesId ? (
              <Link href={`/categories?category=${casesId}`}>
                <ImageCard src="/gabinete-card.png" alt="Gabinete" title="Gabinetes" />
              </Link>
            ) : (
              <ImageCard src="/gabinete-card.png" alt="Gabinete" title="Gabinetes" />
            );
          })()}
          {(() => {
            const peripheralsId = categories.find((c) => c.name === "Peripherals")?.id;
            return peripheralsId ? (
              <Link href={`/categories?category=${peripheralsId}`}>
                <ImageCard src="/headphone-card.png" alt="Headphone" title="Fones de ouvido" />
              </Link>
            ) : (
              <ImageCard src="/headphone-card.png" alt="Headphone" title="Fones de ouvido" />
            );
          })()}
          {(() => {
            const memoryId = categories.find((c) => c.name === "Memory")?.id;
            return memoryId ? (
              <Link href={`/categories?category=${memoryId}`}>
                <ImageCard src="/memoria-card.png" alt="Memória" title="Memórias" />
              </Link>
            ) : (
              <ImageCard src="/memoria-card.png" alt="Memória" title="Memórias" />
            );
          })()}
          {(() => {
            const gpuId = categories.find((c) => c.name === "GPUs")?.id;
            return gpuId ? (
              <Link href={`/categories?category=${gpuId}`}>
                <ImageCard src="/placa-video-card.png" alt="Placa de Vídeo" title="Placas de Vídeo" />
              </Link>
            ) : (
              <ImageCard src="/placa-video-card.png" alt="Placa de Vídeo" title="Placas de Vídeo" />
            );
          })()}
        </div>
      </main>
    </div>
  );
}
