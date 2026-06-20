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
    <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-body text-dark">{t("total")}</span>
        <span className="text-title font-bold text-primary">${total.toFixed(2)}</span>
      </div>
      <Button variant="success" fullWidth onClick={onCheckout} disabled={disabled}>
        {t("checkout")}
      </Button>
    </div>
  );
}
