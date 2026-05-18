"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, NAV_ITEMS, ROUTES } from "@/constants";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role || "USER"),
  );

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-gray-50 p-4">
      <div className="mb-6">
        <Link href={ROUTES.marketplace} className="text-sm font-semibold">
          {APP_NAME}
        </Link>
        <p className="mt-1 truncate text-xs text-gray-500">{user?.email}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3 py-2 text-sm ${
                active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Button variant="secondary" onClick={logout} className="mt-4 w-full">
        Logout
      </Button>
    </aside>
  );
}
