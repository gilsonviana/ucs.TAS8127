"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
}

export default function SearchBar({ value, onChange, onSubmit, className = "" }: SearchBarProps) {
  const t = useTranslations("nav");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && onSubmit) {
      onSubmit(value);
    }
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        size={16}
        className="absolute left-3 text-gray-400 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("search")}
        className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 bg-white text-dark placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
      />
    </div>
  );
}
