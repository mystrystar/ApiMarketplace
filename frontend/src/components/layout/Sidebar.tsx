"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRightLeft,
  BriefcaseBusiness,
  ChartColumnIncreasing,
  FileText,
  House,
  ShoppingBag,
  Users,
} from "lucide-react";
import { NAV_ITEMS, ROUTES } from "@/constants";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Overview: House,
  "Browse APIs": ArrowRightLeft,
  Logs: FileText,
  "Manage APIs": BriefcaseBusiness,
  Users: Users,
  Purchases: ShoppingBag,
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const links = NAV_ITEMS.filter((item) => item.roles.includes(user?.role || "USER"));
  const homeHref = user?.role === "ADMIN" ? ROUTES.admin : ROUTES.dashboard;

  return (
    <aside className="fixed inset-x-0 bottom-0 z-30 flex border-t border-white/10 bg-[#061126]/95 p-2 shadow-[0_-16px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:sticky md:inset-y-0 md:h-screen md:w-[255px] md:shrink-0 md:flex md:flex-col md:justify-between md:border-r md:border-t-0 md:px-4 md:py-5">
      <div className="md:flex md:min-h-0 md:flex-1 md:flex-col">
        <div className="mb-6 hidden items-center gap-3 md:flex">
          <Link
            href={homeHref}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-xl font-black text-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.14)]"
          >
            A
          </Link>
          <div className="min-w-0">
            <Link href={homeHref} className="block truncate text-sm font-bold text-white">
              API Marketplace
            </Link>
            <p className="truncate text-[11px] text-cyan-200/75">Developer Gateway</p>
          </div>
        </div>

        <nav className="grid flex-1 grid-cols-4 gap-1 md:flex md:flex-col md:gap-2">
          {links.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== ROUTES.admin && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-center gap-2 rounded-xl px-2 py-[10px] text-center text-xs font-medium transition md:justify-start md:px-3 md:text-left md:text-[13px] ${
                  active
                    ? "border border-cyan-300/20 bg-gradient-to-r from-blue-500/35 to-violet-500/30 text-cyan-100 shadow-[0_12px_30px_rgba(37,99,235,0.18)]"
                    : "border border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-slate-100"
                }`}
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-lg ${
                    active ? "bg-white/10 text-cyan-200" : "bg-white/[0.04] text-slate-400"
                  }`}
                >
                  {(() => {
                    const Icon = icons[item.label] || ChartColumnIncreasing;
                    return <Icon className="h-3.5 w-3.5" />;
                  })()}
                </span>
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 hidden rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 md:block">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/20 text-blue-200">
              <ChartColumnIncreasing className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-white">Need admin access?</p>
              <p className="text-[10px] leading-4 text-slate-400">For account issues or API queries, contact support.</p>
            </div>
          </div>
          <a
            href="mailto:support@marketplace.local"
            className="flex justify-center rounded-xl border border-blue-400/25 bg-blue-400/10 px-3 py-2 text-xs font-semibold text-blue-200"
          >
            Contact Team
          </a>
        </div>
      </div>

      <div className="mt-auto hidden md:flex md:flex-col md:gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
            {(user?.email || "?").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs text-white">{user?.email}</p>
            <p className="text-[10px] text-slate-400">{user?.role === "ADMIN" ? "Administrator" : "Consumer"}</p>
          </div>
        </div>
        <Button variant="danger" onClick={logout} className="w-full">
          Logout
        </Button>
      </div>
    </aside>
  );
}
