const { PAGINATION } = require('../constants');

function buildLogWhere(query, userId) {
  const where = {};
  if (userId) where.userId = userId;
  if (query.apiId) where.apiId = query.apiId;
  if (query.method) where.method = String(query.method).toUpperCase();
  if (query.status) where.statusCode = parseInt(query.status, 10);
  if (query.from || query.to) {
    where.createdAt = {};
    if (query.from) where.createdAt.gte = new Date(query.from);
    if (query.to) where.createdAt.lte = new Date(query.to);
  }
  return where;
}

function getPagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT),
  );
  return { page, limit, skip: (page - 1) * limit };
}

async function fetchPaginatedLogs(prisma, { query, userId, includeUser }) {
  const where = buildLogWhere(query, userId);
  const { page, limit, skip } = getPagination(query);

  const include = {
    api: { select: { id: true, title: true, slug: true, method: true } },
  };
  if (includeUser) {
    include.user = { select: { id: true, email: true, name: true } };
  }

  const [logs, total] = await Promise.all([
    prisma.apiCallLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include,
    }),
    prisma.apiCallLog.count({ where }),
  ]);

  return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
}

module.exports = { fetchPaginatedLogs };
