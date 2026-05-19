const prisma = require('../lib/prisma');
const { ERRORS, SUBSCRIPTION_STATUS } = require('../constants');
const { generateApiKey } = require('../utils/apiKey');
const { fetchPaginatedLogs } = require('../utils/logsQuery');

async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { apis: true } },
      },
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name },
      select: { id: true, email: true, name: true, role: true },
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function getDashboard(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true },
    });

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user.id, status: SUBSCRIPTION_STATUS.ACTIVE },
      include: {
        api: { select: { id: true, title: true, slug: true, category: true, status: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const purchases = await prisma.purchase.findMany({
      where: { userId: req.user.id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        api: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalCalls = await prisma.apiCallLog.count({
      where: { userId: req.user.id },
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const callsToday = await prisma.apiCallLog.count({
      where: { userId: req.user.id, createdAt: { gte: startOfDay } },
    });

    const recentLogs = await prisma.apiCallLog.findMany({
      where: { userId: req.user.id },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        api: { select: { id: true, title: true, slug: true } },
      },
    });

    const totalQuota = subscriptions.reduce((sum, sub) => sum + sub.totalQuota, 0);
    const remainingQuota = subscriptions.reduce(
      (sum, sub) => sum + sub.remainingQuota,
      0,
    );
    const quotaHealth = totalQuota ? Math.round((remainingQuota / totalQuota) * 100) : 0;

    res.json({
      user,
      subscriptions,
      purchases,
      totalCalls,
      callsToday,
      quotaHealth,
      recentLogs,
    });
  } catch (err) {
    next(err);
  }
}

async function regenerateApiKey(req, res, next) {
  try {
    const apiKey = generateApiKey();
    const subscription = await prisma.subscription.findFirst({
      where: { id: req.params.subscriptionId, userId: req.user.id },
      select: { id: true },
    });

    if (!subscription) {
      return res.status(404).json({ error: ERRORS.NOT_FOUND });
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { apiKey },
    });

    res.json({ apiKey });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: ERRORS.NOT_FOUND });
    }
    next(err);
  }
}

async function getLogs(req, res, next) {
  try {
    const result = await fetchPaginatedLogs(prisma, {
      query: req.query,
      userId: req.user.id,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getDashboard,
  regenerateApiKey,
  getLogs,
};
