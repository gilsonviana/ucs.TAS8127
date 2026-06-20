"use client";

import { useState } from "react";
import { ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SearchBar from "./SearchBar";
import IconButton from "./IconButton";

interface NavigationBarProps {
  cartCount?: number;
  isAuthenticated?: boolean;
  onSearch?: (query: string) => void;
}

export default function NavigationBar({
  cartCount = 0,
  isAuthenticated = false,
  onSearch,
}: NavigationBarProps) {
  const t = useTranslations("nav");
  const [query, setQuery] = useState("");

  function handleSearchChange(value: string) {
    setQuery(value);
    onSearch?.(value);
  }

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-white font-bold text-title">⚡</span>
          <span className="text-white font-bold text-body-bold hidden sm:block">
            TechStore
          </span>
        </Link>

        <div className="flex-1">
          <SearchBar value={query} onChange={handleSearchChange} />
        </div>

        <nav className="flex items-center gap-1 shrink-0">
          <Link href="/cart">
            <IconButton variant="ghost" label={t("cart")} className="relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs-body rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </IconButton>
          </Link>
          <Link href={isAuthenticated ? "/account" : "/login"}>
            <IconButton variant="ghost" label={isAuthenticated ? t("account") : t("login")}>
              <User size={20} />
            </IconButton>
          </Link>
        </nav>
      </div>
    </header>
  );
}
