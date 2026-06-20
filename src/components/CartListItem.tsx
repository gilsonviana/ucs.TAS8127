"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import IconButton from "./IconButton";
import ItemCounter from "./ItemCounter";


interface CartListItemProps {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  onRemove: (productId: number) => void;
  onIncrement: (productId: number) => void;
  onDecrement: (productId: number) => void;
}

export default function CartListItem({
  productId,
  name,
  price,
  quantity,
  imageUrl,
  onRemove,
  onIncrement,
  onDecrement,
}: CartListItemProps) {
  const t = useTranslations("cart");
  const tProduct = useTranslations("product");

  return (
    <div className="flex gap-4 items-center border border-gray-200 p-3">
      <div className="relative w-16 h-16 shrink-0 bg-gray-100 rounded-md overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs-body">
            {tProduct("noImage")}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm-body font-medium text-dark truncate">{name}</p>
        <p className="text-body-bold font-bold text-primary">${price.toFixed(2)}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <IconButton
          variant="clean"
          label={t("remove")}
          onClick={() => onRemove(productId)}
          className="text-error"
        >
          <Trash2 size={16} />
        </IconButton>
        <ItemCounter
          value={quantity}
          onIncrement={() => onIncrement(productId)}
          onDecrement={() => onDecrement(productId)}
        />
      </div>
    </div>
  );
}
