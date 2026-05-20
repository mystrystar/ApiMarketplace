export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const API_PATHS = {
  health: "/health",
  login: "/auth/login",
  register: "/auth/register",
  me: "/auth/me",
  apis: "/apis",
  api: (id: string) => `/apis/${id}`,
  apiPurchase: (id: string) => `/apis/${id}/purchase`,
  dashboard: "/users/dashboard",
  regenerateSubscriptionKey: (id: string) =>
    `/users/subscriptions/${id}/api-key/regenerate`,
  userLogs: "/users/logs",
  adminApis: "/admin/apis",
  adminApi: (id: string) => `/admin/apis/${id}`,
  adminUsers: "/admin/users",
  adminUser: (id: string) => `/admin/users/${id}`,
  adminPurchases: "/admin/purchases",
  adminAnalytics: "/admin/analytics",
  adminLogs: "/admin/logs",
} as const;

export const DEFAULT_PAGE_SIZE = 20;
