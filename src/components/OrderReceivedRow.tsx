import { useTranslations } from "next-intl";

interface OrderReceivedRowProps {
  orderId: number;
  date: string;
  customerName: string;
  total: number;
}

export default function OrderReceivedRow({
  orderId,
  date,
  customerName,
  total,
}: OrderReceivedRowProps) {
  const t = useTranslations("admin");

  return (
    <div className="flex items-center gap-4 bg-white rounded-lg px-4 py-3 shadow-sm">
      <span className="text-sm-body font-bold text-dark w-24 shrink-0">
        {t("orderNumber")}{orderId}
      </span>
      <span className="text-sm-body text-gray-500 w-36 shrink-0">{date}</span>
      <span className="text-sm-body text-dark flex-1 truncate">{customerName}</span>
      <span className="text-sm-body font-bold text-primary shrink-0">
        ${total.toFixed(2)}
      </span>
    </div>
  );
}
