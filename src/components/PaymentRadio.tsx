"use client";

import { Building2, FileText, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";

type PaymentMethod = "credit_card" | "debit_card" | "pix" | "bank_slip";

interface PaymentRadioProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

const getIcon = (id: PaymentMethod) => {
  switch (id) {
    case "pix":
      return <Building2 size={32} className="text-primary" />;
    case "bank_slip":
      return <FileText size={32} className="text-primary" />;
    case "credit_card":
    case "debit_card":
      return <CreditCard size={32} className="text-primary" />;
  }
};

export default function PaymentRadio({ value, onChange }: PaymentRadioProps) {
  const t = useTranslations("checkout");

  const options: { id: PaymentMethod; label: string }[] = [
    { id: "pix", label: t("pix") },
    { id: "bank_slip", label: t("bankSlip") },
    { id: "credit_card", label: t("creditCard") },
  ];

  return (
    <fieldset className="flex flex-col gap-3">
      {options.map((opt) => (
        <label key={opt.id} className="cursor-pointer">
          <div
            className={`border-2 rounded-lg p-4 flex items-center gap-4 transition ${value === opt.id
                ? "border-primary bg-primary/5"
                : "border-gray-200 bg-gray-100 hover:border-primary/50"
              }`}
          >
            <input
              type="radio"
              name="payment"
              value={opt.id}
              checked={value === opt.id}
              onChange={() => onChange(opt.id)}
              className="w-5 h-5 accent-dark cursor-pointer shrink-0"
            />
            <div className="flex items-center justify-center shrink-0">
              {getIcon(opt.id)}
            </div>
            <span className="text-sm-body font-medium text-dark">
              {opt.label}
            </span>
          </div>
        </label>
      ))}
    </fieldset>
  );
}
