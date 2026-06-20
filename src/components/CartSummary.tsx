"use client";

import { useTranslations } from "next-intl";
import Button from "./Button";

interface CartSummaryProps {
  total: number;
  onCheckout: () => void;
  disabled?: boolean;
}

const FREIGHT_COST = 9.99;

export default function CartSummary({ total, onCheckout, disabled = false }: CartSummaryProps) {
  const t = useTranslations("cart");
  const finalTotal = total + FREIGHT_COST;

  return (
    <div className="border border-gray-200 p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-sm-body text-gray-600">{t("subtotal")}</span>
          <span className="text-body font-medium text-dark">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm-body text-gray-600">{t("freight")}</span>
          <span className="text-body font-medium text-dark">${FREIGHT_COST.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
          <span className="text-body-bold text-dark">{t("totalOrder")}</span>
          <span className="text-body-bold text-dark">${finalTotal.toFixed(2)}</span>
        </div>
      </div>
      <Button variant="success" fullWidth onClick={onCheckout} disabled={disabled}>
        {t("checkout")}
      </Button>
    </div>
  );
}
