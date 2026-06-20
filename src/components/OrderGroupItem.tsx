import { useTranslations } from "next-intl";
import Button from "./Button";
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
  onBuyAgain?: () => void;
  showProductPrices?: boolean;
  showOrderTotal?: boolean;
}

export default function OrderGroupItem({
  orderId,
  date,
  total,
  items,
  onBuyAgain,
  showProductPrices = true,
  showOrderTotal = false,
}: OrderGroupItemProps) {
  const t = useTranslations("orders");

  return (
    <div className="border border-gray-200">
      <div className="flex justify-between items-center px-4 py-3 bg-gray-100 border-b border-gray-200">
        <span className="text-sm-body font-bold text-dark">
          {t("order")} #{orderId}
        </span>
        <span className="text-xs-body text-gray-600">{date}</span>
      </div>
      <div className="px-4 divide-y divide-gray-200">
        {items.map((item) => (
          <OrderGroupProductItem key={item.productId} {...item} showPrice={showProductPrices} />
        ))}
      </div>
      <div className="flex justify-between items-center px-4 py-4 border-t border-gray-200 gap-4">
        {showOrderTotal && (
          <span className="text-sm-body font-bold text-dark">
            {t("total")}: ${total.toFixed(2)}
          </span>
        )}
        {onBuyAgain && (
          <Button variant="ghost" onClick={onBuyAgain}>
            {t("buyAgain")}
          </Button>
        )}
      </div>
    </div>
  );
}
