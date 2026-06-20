"use client";

import { useTranslations } from "next-intl";

type PaymentMethod = "credit_card" | "debit_card" | "pix" | "bank_slip";

interface PaymentRadioProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export default function PaymentRadio({ value, onChange }: PaymentRadioProps) {
  const t = useTranslations("checkout");

  const options: { id: PaymentMethod; label: string }[] = [
    { id: "credit_card", label: t("creditCard") },
    { id: "debit_card", label: t("debitCard") },
    { id: "pix", label: t("pix") },
    { id: "bank_slip", label: t("bankSlip") },
  ];

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-body-bold font-bold text-white mb-1">
        {t("paymentMethod")}
      </legend>
      {options.map((opt) => (
        <label
          key={opt.id}
          className="flex items-center gap-3 cursor-pointer text-white text-body"
        >
          <input
            type="radio"
            name="payment"
            value={opt.id}
            checked={value === opt.id}
            onChange={() => onChange(opt.id)}
            className="accent-primary w-4 h-4"
          />
          {opt.label}
        </label>
      ))}
    </fieldset>
  );
}
