"use client";

import { useTranslations } from "next-intl";

type PaymentMethod = "credit_card" | "debit_card" | "pix" | "bank_slip";

interface PaymentRadioProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export default function PaymentRadio({ value, onChange }: PaymentRadioProps) {
  const t = useTranslations("checkout");

  const options: { id: PaymentMethod; label: string; image: string }[] = [
    { id: "pix", label: t("pix"), image: "/pix.png" },
    { id: "bank_slip", label: t("bankSlip"), image: "/boleto.png" },
    { id: "credit_card", label: t("creditCard"), image: "/cartao.png" },
  ];

  return (
    <fieldset className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => (
          <label key={opt.id} className="cursor-pointer">
            <input
              type="radio"
              name="payment"
              value={opt.id}
              checked={value === opt.id}
              onChange={() => onChange(opt.id)}
              className="sr-only"
            />
            <div
              className={`border-2 rounded-lg p-4 flex flex-col items-center gap-3 transition ${
                value === opt.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-gray-100 hover:border-primary/50"
              }`}
            >
              <div className="relative w-10 h-15 bg-white rounded border border-gray-300 flex items-center justify-center overflow-hidden">
                {/* Placeholder for payment method image */}
                <span className="text-xs text-gray-400">IMG</span>
              </div>
              <span className="text-xs-body font-medium text-dark text-center">
                {opt.label}
              </span>
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
