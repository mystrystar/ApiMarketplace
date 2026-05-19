const prisma = require('../lib/prisma');
const { API_STATUS, ERRORS, ROLES } = require('../constants');
const { toSlug } = require('../utils/slug');
const { fetchPaginatedLogs } = require('../utils/logsQuery');

async function listUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { apis: true, purchases: true, subscriptions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ users });
  } catch (err) {
    next(err);
  }
}

async function getUserDetails(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: ERRORS.USER_NOT_FOUND });
    }

    const [purchases, subscriptions, recentLogs] = await Promise.all([
      prisma.purchase.findMany({
        where: { userId: user.id },
        include: {
          api: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.subscription.findMany({
        where: { userId: user.id },
        include: {
          api: { select: { id: true, title: true, slug: true, status: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.apiCallLog.findMany({
        where: { userId: user.id },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          api: { select: { id: true, title: true, slug: true } },
          user: { select: { id: true, email: true, name: true } },
        },
      }),
    ]);

    res.json({ user, purchases, subscriptions, recentLogs });
  } catch (err) {
    next(err);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;

    if (!ROLES.includes(role)) {
      return res.status(400).json({ error: `Role must be ${ROLES.join(' or ')}` });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });

    res.json({ user });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: ERRORS.USER_NOT_FOUND });
    }
    next(err);
  }
}

async function listApis(req, res, next) {
  try {
    const apis = await prisma.api.findMany({
      include: {
        provider: { select: { id: true, email: true, name: true } },
        _count: { select: { purchases: true, apiCallLogs: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ apis });
  } catch (err) {
    next(err);
  }
}

async function createApi(req, res, next) {
  try {
    const {
      title,
      description,
      baseUrl,
      category,
      pricePerCall,
      slug,
      defaultQuota,
      dummyResponse,
      status,
    } = req.body;

    if (!title || !baseUrl) {
      return res.status(400).json({ error: 'Title and baseUrl are required' });
    }

    const apiSlug = slug ? toSlug(slug) : toSlug(title);
    if (!apiSlug) {
      return res.status(400).json({ error: 'A valid slug is required' });
    }

    const api = await prisma.api.create({
      data: {
        slug: apiSlug,
        title,
        description,
        baseUrl,
        category,
        pricePerCall: pricePerCall ?? 0,
        defaultQuota: defaultQuota ?? 100,
        dummyResponse,
        status: status || API_STATUS.APPROVED,
        providerId: req.user.id,
      },
    });

    res.status(201).json({ api });
  } catch (err) {
    next(err);
  }
}

async function updateApi(req, res, next) {
  try {
    const {
      title,
      description,
      baseUrl,
      category,
      pricePerCall,
      defaultQuota,
      dummyResponse,
      status,
    } = req.body;

    const api = await prisma.api.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        baseUrl,
        category,
        pricePerCall,
        defaultQuota,
        dummyResponse,
        status,
      },
    });

    res.json({ api });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: ERRORS.API_NOT_FOUND });
    }
    next(err);
  }
}

async function listPendingApis(req, res, next) {
  try {
    const apis = await prisma.api.findMany({
      where: { status: 'PENDING' },
      include: {
        provider: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ apis });
  } catch (err) {
    next(err);
  }
}

async function updateApiStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (![API_STATUS.APPROVED, API_STATUS.REJECTED].includes(status)) {
      return res.status(400).json({
        error: `Status must be ${API_STATUS.APPROVED} or ${API_STATUS.REJECTED}`,
      });
    }

    const api = await prisma.api.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        provider: { select: { id: true, email: true, name: true } },
      },
    });

    res.json({ api });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: ERRORS.API_NOT_FOUND });
    }
    next(err);
  }
}

async function deleteApi(req, res, next) {
  try {
    await prisma.api.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: ERRORS.API_NOT_FOUND });
    }
    next(err);
  }
}

async function listPurchases(req, res, next) {
  try {
    const where = {};
    if (req.query.userId) where.userId = req.query.userId;
    if (req.query.apiId) where.apiId = req.query.apiId;

    const purchases = await prisma.purchase.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, name: true } },
        api: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ purchases });
  } catch (err) {
    next(err);
  }
}

async function getAnalytics(req, res, next) {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const totalCallsToday = await prisma.apiCallLog.count({
      where: { createdAt: { gte: startOfDay } },
    });

    const revenueResult = await prisma.purchase.aggregate({
      _sum: { amount: true },
    });

    const logs = await prisma.apiCallLog.findMany({
      select: { apiId: true, userId: true, apiName: true, api: { select: { title: true } } },
    });

    const apiCounts = {};
    const userCounts = {};

    for (const log of logs) {
      const apiKey = log.apiId || log.apiName;
      apiCounts[apiKey] = apiCounts[apiKey] || {
        apiId: log.apiId,
        title: log.api?.title || log.apiName,
        count: 0,
      };
      apiCounts[apiKey].count += 1;
      if (log.userId) {
        userCounts[log.userId] = (userCounts[log.userId] || 0) + 1;
      }
    }

    const topApis = Object.values(apiCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topUserIds = Object.entries(userCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, count]) => ({ userId, count }));

    const users = await prisma.user.findMany({
      where: { id: { in: topUserIds.map((u) => u.userId) } },
      select: { id: true, email: true, name: true },
    });

    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
    const topUsers = topUserIds.map((item) => ({
      ...userMap[item.userId],
      count: item.count,
    }));

    res.json({
      totalCallsToday,
      revenue: revenueResult._sum.amount || 0,
      topApis,
      topUsers,
    });
  } catch (err) {
    next(err);
  }
}

async function listLogs(req, res, next) {
  try {
    const result = await fetchPaginatedLogs(prisma, {
      query: req.query,
      includeUser: true,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUsers,
  getUserDetails,
  updateUserRole,
  listApis,
  createApi,
  updateApi,
  listPendingApis,
  updateApiStatus,
  deleteApi,
  listPurchases,
  getAnalytics,
  listLogs,
};
