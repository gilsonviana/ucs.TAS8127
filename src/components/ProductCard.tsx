"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import IconButton from "./IconButton";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (id: number) => void;
}

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  onAddToCart,
}: ProductCardProps) {
  const t = useTranslations("product");

  return (
    <div className="border border-gray-200 overflow-hidden flex flex-col">
      <div className="relative w-full h-48 bg-gray-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs-body">
            {t("noImage")}
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-sm-body font-medium text-dark line-clamp-2">{name}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-body-bold font-bold text-primary">
            ${price.toFixed(2)}
          </span>
          <IconButton
            variant="clean"
            label={t("addToCart")}
            onClick={() => onAddToCart(id)}
          >
            <ShoppingCart size={16} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
