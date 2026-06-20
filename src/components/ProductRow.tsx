import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import IconButton from "./IconButton";

interface ProductRowProps {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ProductRow({
  id,
  name,
  price,
  imageUrl,
  onEdit,
  onDelete,
}: ProductRowProps) {
  const t = useTranslations("admin");

  return (
    <div className="flex items-center gap-4 bg-white rounded-lg px-4 py-3 shadow-sm">
      <div className="relative w-10 h-10 shrink-0 rounded-md overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs-body">
            —
          </div>
        )}
      </div>
      <span className="flex-1 text-sm-body font-medium text-dark truncate">{name}</span>
      <span className="text-sm-body font-bold text-primary shrink-0">
        ${price.toFixed(2)}
      </span>
      <IconButton variant="clean" label={t("edit")} onClick={() => onEdit(id)}>
        <Pencil size={16} />
      </IconButton>
      <IconButton variant="clean" label={t("delete")} onClick={() => onDelete(id)} className="text-error">
        <Trash2 size={16} />
      </IconButton>
    </div>
  );
}
