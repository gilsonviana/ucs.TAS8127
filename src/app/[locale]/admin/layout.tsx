"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, ShoppingBag, Tag, Package, LogOut, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("admin");
  const tNav = useTranslations("nav");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") router.push("/admin-login");
  }, [isAuthenticated, user, router]);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (!isAuthenticated || user?.role !== "admin") return null;

  const navItems = [
    { href: "/admin", label: t("dashboard"), icon: LayoutDashboard, exact: true },
    { href: "/admin/orders", label: t("orders"), icon: ShoppingBag },
    { href: "/admin/categories", label: t("categories"), icon: Tag },
    { href: "/admin/products", label: t("products"), icon: Package },
  ];

  function isActive(href: string, exact?: boolean) {
    const localePath = pathname.replace(/^\/(en-US|pt-BR)/, "");
    return exact ? localePath === href : localePath.startsWith(href);
  }

  const sidebarContent = (
    <>
      <div className="px-3 mb-6">
        <span className="text-primary font-bold text-title">⚡</span>
        <span className="text-white font-bold text-body-bold ml-2">TechStore</span>
        <p className="text-xs-body text-gray-400 mt-1">{t("adminPanel")}</p>
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href as "/admin"}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm-body transition
              ${active ? "bg-primary text-white" : "text-gray-300 hover:bg-white/10"}`}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}

      <div className="mt-auto">
        <button
          onClick={() => { logout(); router.push("/admin-login"); }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm-body text-gray-300 hover:bg-white/10 transition"
        >
          <LogOut size={16} />
          {tNav("logout")}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 bg-dark flex-col py-6 px-3 gap-1">
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-56 bg-dark flex flex-col py-6 px-3 gap-1">
            {sidebarContent}
          </div>
          <button
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-label={t("close")}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col bg-void min-h-screen">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 bg-dark px-4 py-3 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="text-white"
          >
            <Menu size={22} />
          </button>
          <span className="text-primary font-bold text-title">⚡</span>
          <span className="text-white font-bold text-body-bold">TechStore</span>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="ml-auto text-white" aria-label={t("close")}>
              <X size={22} />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
