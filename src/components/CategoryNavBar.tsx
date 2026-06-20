"use client";

import { useTranslations } from "next-intl";

interface Category { id: number; name: string; }

interface CategoryNavBarProps {
  categories: Category[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

export default function CategoryNavBar({ categories, selected, onSelect }: CategoryNavBarProps) {
  const t = useTranslations("categories");

  return (
    <nav aria-label={t("title")} className="flex gap-2 overflow-x-auto py-2 px-4 bg-void/80">
      <button
        onClick={() => onSelect(null)}
        aria-pressed={selected === null}
        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm-body transition
          ${selected === null ? "bg-primary text-white" : "text-white hover:bg-white/10"}`}
      >
        {t("all")}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          aria-pressed={selected === cat.id}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm-body transition
            ${selected === cat.id ? "bg-primary text-white" : "text-white hover:bg-white/10"}`}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );
}
