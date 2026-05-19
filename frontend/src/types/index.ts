export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  createdAt?: string;
  _count?: {
    apis?: number;
    purchases?: number;
    subscriptions?: number;
    apiCallLogs?: number;
  };
}

export interface ApiItem {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  baseUrl?: string | null;
  method: "GET" | "POST";
  category?: string | null;
  pricePerCall: number;
  defaultQuota: number;
  dummyResponse?: unknown;
  status: string;
  provider?: { id: string; name?: string | null; email: string };
  _count?: { purchases?: number; apiCallLogs?: number };
}

export interface Subscription {
  id: string;
  apiKey: string;
  totalQuota: number;
  remainingQuota: number;
  status: string;
  api: {
    id: string;
    title: string;
    slug: string;
    method?: string;
    category?: string | null;
    status?: string;
    defaultQuota?: number;
  };
}

export interface ApiCallLog {
  id: string;
  statusCode: number;
  method: string;
  responseTimeMs: number;
  ipAddress?: string | null;
  apiName: string;
  createdAt: string;
  api?: { id: string; title: string; slug: string; method?: string } | null;
  user?: { id: string; email: string; name?: string | null };
}

export interface Purchase {
  id: string;
  amount: number;
  quota: number;
  createdAt: string;
  user: { id: string; email: string; name?: string | null };
  api: { id: string; title: string; slug: string };
}

export interface DashboardData {
  user: User;
  subscriptions: Subscription[];
  purchases: Purchase[];
  totalCalls: number;
  callsToday: number;
  quotaHealth: number;
  recentLogs: ApiCallLog[];
}

export interface AdminUserDetails {
  user: User;
  subscriptions: Subscription[];
  purchases: Purchase[];
  recentLogs: ApiCallLog[];
}

export interface Analytics {
  totalUsers: number;
  totalApis: number;
  totalCallsToday: number;
  revenue: number;
  topApis: { apiId: string; title: string; count: number }[];
  topUsers: { id?: string; email?: string; name?: string | null; count: number }[];
  recentUsers: { id: string; email: string; name?: string | null; createdAt: string }[];
}

export interface PaginatedLogs {
  logs: ApiCallLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
