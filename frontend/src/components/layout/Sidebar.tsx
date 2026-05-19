"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, ROUTES } from "@/constants";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role || "USER"),
  );
  const icons: Record<string, string> = {
    Marketplace: "⌂",
    Dashboard: "▦",
    Logs: "☷",
    "Manage APIs": "</>",
    Users: "◉",
    Purchases: "▤",
  };

  return (
    <aside className="fixed inset-x-0 bottom-0 z-20 flex border-t border-[var(--border)] bg-[var(--bg-surface)] p-2 md:sticky md:inset-y-0 md:h-screen md:w-[240px] md:shrink-0 md:flex-col md:justify-between md:border-r md:border-t-0 md:px-4 md:py-6">
      <div>
      <div className="mb-6">
        <Link
          href={user?.role === "ADMIN" ? ROUTES.admin : ROUTES.marketplace}
          className="hidden text-[15px] font-bold md:block"
        >
          <span className="text-[var(--accent)]">API</span>{" "}
          <span className="text-white">Marketplace</span>
        </Link>
        <p className="mt-1 hidden truncate text-[11px] text-[var(--muted)] md:block">
          {user?.email}
        </p>
      </div>
      <nav className="grid flex-1 grid-cols-4 gap-1 md:flex md:flex-col">
        {links.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border-l-0 px-2 py-[10px] text-center text-xs font-medium transition md:justify-start md:border-l-[3px] md:px-3 md:text-left md:text-[13px] ${
                active
                  ? "border-[var(--accent)] bg-[var(--accent-dim)] pl-[9px] text-[var(--accent)]"
                  : "border-transparent text-[var(--muted)] hover:bg-[rgba(255,255,255,0.04)]"
              }`}
            >
              <span className="text-[11px]">{icons[item.label] || "•"}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      </div>
      <Button variant="danger" onClick={logout} className="mt-4 hidden w-full md:block">
        Logout
      </Button>
    </aside>
  );
}
