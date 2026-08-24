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
  apiDocs: (id: string) => `/marketplace/${id}/docs`,
} as const;

import type { Role } from "@/types";

export const NAV_ITEMS: {
  href: string;
  label: string;
  roles: Role[];
}[] = [
  { href: ROUTES.dashboard, label: "Overview", roles: ["USER"] },
  { href: ROUTES.marketplace, label: "Browse APIs", roles: ["USER"] },
  { href: ROUTES.logs, label: "Logs", roles: ["USER"] },
  { href: ROUTES.admin, label: "Overview", roles: ["ADMIN"] },
  { href: ROUTES.adminApis, label: "Manage APIs", roles: ["ADMIN"] },
  { href: ROUTES.adminUsers, label: "Users", roles: ["ADMIN"] },
  { href: ROUTES.adminPurchases, label: "Purchases", roles: ["ADMIN"] },
];
