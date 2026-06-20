"use client";

import { useTranslations } from "next-intl";
import Button from "./Button";

interface CartSummaryProps {
  total: number;
  onCheckout: () => void;
  disabled?: boolean;
}

export default function CartSummary({ total, onCheckout, disabled = false }: CartSummaryProps) {
  const t = useTranslations("cart");

  return (
    <div className="border border-gray-200 p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <span className="text-body-bold text-dark">{t("total")}</span>
        <span className="text-page-title font-bold text-primary">${total.toFixed(2)}</span>
      </div>
      <Button variant="success" fullWidth onClick={onCheckout} disabled={disabled}>
        {t("checkout")}
      </Button>
    </div>
  );
}
