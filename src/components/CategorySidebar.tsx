"use client";

import { useTranslations } from "next-intl";

interface Category { id: number; name: string; }

interface CategorySidebarProps {
  categories: Category[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

export default function CategorySidebar({ categories, selected, onSelect }: CategorySidebarProps) {
  const t = useTranslations("categories");

  return (
    <aside className="w-56 shrink-0" aria-label={t("title")}>
      <h2 className="text-section-title font-bold text-white mb-4">{t("title")}</h2>
      <ul className="flex flex-col gap-1" role="list">
        <li>
          <button
            onClick={() => onSelect(null)}
            aria-pressed={selected === null}
            className={`w-full text-left px-3 py-2 rounded-md text-sm-body transition
              ${selected === null ? "bg-primary text-white" : "text-white hover:bg-white/10"}`}
          >
            {t("all")}
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => onSelect(cat.id)}
              aria-pressed={selected === cat.id}
              className={`w-full text-left px-3 py-2 rounded-md text-sm-body transition
                ${selected === cat.id ? "bg-primary text-white" : "text-white hover:bg-white/10"}`}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
