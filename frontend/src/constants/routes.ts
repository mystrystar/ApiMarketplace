export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  marketplace: "/marketplace",
  dashboard: "/dashboard",
  logs: "/logs",
  admin: "/admin",
  adminApis: "/admin/apis",
  adminUsers: "/admin/users",
  adminPurchases: "/admin/purchases",
} as const;

import type { Role } from "@/types";

export const NAV_ITEMS: {
  href: string;
  label: string;
  roles: Role[];
}[] = [
  { href: ROUTES.marketplace, label: "Marketplace", roles: ["USER", "ADMIN"] },
  { href: ROUTES.dashboard, label: "Dashboard", roles: ["USER", "ADMIN"] },
  { href: ROUTES.logs, label: "Logs", roles: ["USER", "ADMIN"] },
  { href: ROUTES.admin, label: "Admin", roles: ["ADMIN"] },
  { href: ROUTES.adminApis, label: "Manage APIs", roles: ["ADMIN"] },
  { href: ROUTES.adminUsers, label: "Users", roles: ["ADMIN"] },
  { href: ROUTES.adminPurchases, label: "Purchases", roles: ["ADMIN"] },
];
