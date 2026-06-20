import { useTranslations } from "next-intl";
import Button from "./Button";

interface OrderReceivedRowProps {
  orderId: number;
  date: string;
  customerName: string;
  total: number;
  status?: "pending" | "fulfilled";
  onStatusChange?: (status: "fulfilled") => void;
}

export default function OrderReceivedRow({
  orderId,
  date,
  customerName,
  total,
  status = "pending",
  onStatusChange,
}: OrderReceivedRowProps) {
  const t = useTranslations("admin");

  const statusColor = status === "pending" ? "text-warning" : "text-success";
  const statusLabel = status === "pending" ? t("statusPending") : t("statusFulfilled");

  return (
    <div className="flex items-center gap-4 bg-white border border-gray-200 px-4 py-3">
      <span className="text-sm-body font-bold text-dark w-24 shrink-0">
        {t("orderNumber")}{orderId}
      </span>
      <span className="text-sm-body text-gray-500 w-32 shrink-0">{date}</span>
      <span className="text-sm-body text-dark w-32 shrink-0 truncate">{customerName}</span>
      <span className="text-sm-body font-bold text-primary w-24 shrink-0">
        ${total.toFixed(2)}
      </span>
      <span className={`text-sm-body font-medium ${statusColor} w-24 shrink-0`}>
        {statusLabel}
      </span>
      {status === "pending" && onStatusChange && (
        <Button
          variant="success"
          onClick={() => onStatusChange("fulfilled")}
          className="shrink-0 text-xs-body px-3 py-1"
        >
          {t("fulfill")}
        </Button>
      )}
    </div>
  );
}
