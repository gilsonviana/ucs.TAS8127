"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface Category { id: number; name: string; }

interface CategoryNavBarProps {
  categories: Category[];
  selected?: number | null;
  onSelect?: (id: number | null) => void;
  navigateToCategories?: boolean;
}

export default function CategoryNavBar({ categories, selected, onSelect, navigateToCategories }: CategoryNavBarProps) {
  const t = useTranslations("categories");

  const buttonClasses = (isSelected: boolean) =>
    `whitespace-nowrap px-4 py-1.5 rounded-full text-sm-body transition ${
      isSelected ? "bg-white text-primary" : "text-white hover:bg-white/20"
    }`;

  return (
    <nav aria-label={t("title")} className="w-full flex gap-2 overflow-x-auto py-2 px-4 bg-primary">
      <div className="max-w-7xl mx-auto flex gap-2">
        {navigateToCategories ? (
          <>
            <Link href="/produtos" className={buttonClasses(selected === null)}>
              {t("all")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/produtos?category=${cat.id}`}
                className={buttonClasses(selected === cat.id)}
              >
                {cat.name}
              </Link>
            ))}
          </>
        ) : (
          <>
            <button
              onClick={() => onSelect?.(null)}
              aria-pressed={selected === null}
              className={buttonClasses(selected === null)}
            >
              {t("all")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelect?.(cat.id)}
                aria-pressed={selected === cat.id}
                className={buttonClasses(selected === cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </>
        )}
      </div>
    </nav>
  );
}
