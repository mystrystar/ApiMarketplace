const API_PUBLIC_SELECT = {
  id: true,
  slug: true,
  title: true,
  description: true,
  baseUrl: true,
  method: true,
  category: true,
  pricePerCall: true,
  defaultQuota: true,
  dummyResponse: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  provider: { select: { id: true, name: true, email: true } },
};

module.exports = { API_PUBLIC_SELECT };
