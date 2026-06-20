import { useTranslations } from "next-intl";
import OrderGroupProductItem from "./OrderGroupProductItem";

interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

interface OrderGroupItemProps {
  orderId: number;
  date: string;
  total: number;
  items: OrderItem[];
}

export default function OrderGroupItem({
  orderId,
  date,
  total,
  items,
}: OrderGroupItemProps) {
  const t = useTranslations("orders");

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 bg-void/10 border-b border-gray-100">
        <span className="text-sm-body font-bold text-dark">
          {t("order")} #{orderId}
        </span>
        <span className="text-xs-body text-gray-500">{date}</span>
      </div>
      <div className="px-4 divide-y divide-gray-100">
        {items.map((item) => (
          <OrderGroupProductItem key={item.productId} {...item} />
        ))}
      </div>
      <div className="flex justify-end items-center px-4 py-3 border-t border-gray-100">
        <span className="text-body-bold font-bold text-primary">
          {t("total")}: ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
