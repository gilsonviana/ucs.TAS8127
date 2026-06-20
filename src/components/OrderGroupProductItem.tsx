import Image from "next/image";

interface OrderGroupProductItemProps {
  name: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

export default function OrderGroupProductItem({
  name,
  quantity,
  unitPrice,
  imageUrl,
}: OrderGroupProductItemProps) {
  return (
    <div className="flex gap-3 items-center py-2">
      <div className="relative w-12 h-12 shrink-0 bg-gray-100 rounded-md overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs-body">
            —
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm-body font-medium text-dark truncate">{name}</p>
        <p className="text-xs-body text-gray-500">x{quantity}</p>
      </div>
      <span className="text-sm-body font-bold text-primary shrink-0">
        ${(unitPrice * quantity).toFixed(2)}
      </span>
    </div>
  );
}
