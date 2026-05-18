export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  apiKey?: string;
  createdAt?: string;
}

export interface ApiItem {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  baseUrl: string;
  category?: string | null;
  pricePerCall: number;
  defaultQuota: number;
  status: string;
  provider?: { id: string; name?: string | null; email: string };
  _count?: { purchases?: number; apiCallLogs?: number };
}

export interface Subscription {
  id: string;
  totalQuota: number;
  remainingQuota: number;
  status: string;
  api: { id: string; title: string; slug: string; category?: string | null };
}

export interface ApiCallLog {
  id: string;
  statusCode: number;
  createdAt: string;
  api: { id: string; title: string; slug: string };
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
  totalCalls: number;
  recentLogs: ApiCallLog[];
}

export interface Analytics {
  totalCallsToday: number;
  revenue: number;
  topApis: { apiId: string; title: string; count: number }[];
  topUsers: { id?: string; email?: string; name?: string | null; count: number }[];
}

export interface PaginatedLogs {
  logs: ApiCallLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
