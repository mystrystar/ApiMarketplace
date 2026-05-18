export const APP_NAME = "API Marketplace";

export const AUTH_LABELS = {
  loginTitle: "Sign in",
  signupTitle: "Create account",
  email: "Email",
  password: "Password",
  name: "Name",
  loginBtn: "Sign in",
  signupBtn: "Sign up",
  noAccount: "No account?",
  hasAccount: "Already have an account?",
} as const;

export const MARKETPLACE_LABELS = {
  title: "API Catalog",
  search: "Search APIs",
  category: "Category",
  allCategories: "All categories",
  buy: "Buy",
  method: "Method",
  quotaPack: "Quota pack",
  price: "Price",
  empty: "No APIs found",
} as const;

export const DASHBOARD_LABELS = {
  title: "My Dashboard",
  subscriptions: "Subscribed APIs",
  remainingQuota: "Remaining quota",
  totalCalls: "Total API calls",
  recentActivity: "Recent activity",
  apiKey: "API Key",
  regenerate: "Regenerate key",
  copy: "Copy",
  noSubs: "No subscriptions yet",
} as const;

export const LOGS_LABELS = {
  title: "API Call Logs",
  api: "API",
  status: "Status",
  from: "From",
  to: "To",
  allApis: "All APIs",
  allStatuses: "All statuses",
  prev: "Previous",
  next: "Next",
  empty: "No logs found",
} as const;

export const ADMIN_LABELS = {
  title: "Admin Dashboard",
  analytics: "Analytics",
  callsToday: "Calls today",
  revenue: "Revenue",
  topApis: "Top APIs",
  topUsers: "Top users",
  createApi: "Create API",
  editApi: "Edit API",
  deleteApi: "Delete",
  save: "Save",
  cancel: "Cancel",
  users: "Users",
  purchases: "Purchases",
  titleField: "Title",
  slug: "Slug",
  description: "Description",
  baseUrl: "Base URL",
  category: "Category",
  pricePerCall: "Price per call",
  defaultQuota: "Default quota",
  status: "Status",
} as const;

export const TABLE_COLS = {
  api: "API",
  date: "Date",
  status: "Status",
  user: "User",
  email: "Email",
  role: "Role",
  amount: "Amount",
  quota: "Quota",
  actions: "Actions",
} as const;
