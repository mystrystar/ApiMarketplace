const prisma = require('../lib/prisma');
const { API_STATUS, ERRORS, SUBSCRIPTION_STATUS } = require('../constants');

async function invoke(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(401).json({ error: ERRORS.API_KEY_REQUIRED });
    }

    const user = await prisma.user.findUnique({ where: { apiKey } });
    if (!user) {
      return res.status(401).json({ error: ERRORS.INVALID_API_KEY });
    }

    const api = await prisma.api.findFirst({
      where: { slug: req.params.apiSlug, status: API_STATUS.APPROVED },
    });
    if (!api) {
      return res.status(404).json({ error: ERRORS.API_NOT_FOUND });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        apiId: api.id,
        status: SUBSCRIPTION_STATUS.ACTIVE,
      },
    });
    if (!subscription) {
      return res.status(403).json({ error: ERRORS.NO_SUBSCRIPTION });
    }

    if (subscription.remainingQuota <= 0) {
      return res.status(429).json({ error: ERRORS.QUOTA_EXHAUSTED });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.subscription.updateMany({
        where: { id: subscription.id, remainingQuota: { gt: 0 } },
        data: { remainingQuota: { decrement: 1 } },
      });

      if (updated.count === 0) return null;

      const log = await tx.apiCallLog.create({
        data: {
          userId: user.id,
          apiId: api.id,
          subscriptionId: subscription.id,
          statusCode: 200,
        },
      });

      const sub = await tx.subscription.findUnique({
        where: { id: subscription.id },
        select: { remainingQuota: true },
      });

      return { log, remainingQuota: sub.remainingQuota };
    });

    if (!result) {
      return res.status(429).json({ error: ERRORS.QUOTA_EXHAUSTED });
    }

    res.json({
      success: true,
      api: api.slug,
      data: { message: 'Dummy API response', timestamp: new Date().toISOString() },
      quota: { remaining: result.remainingQuota },
      logId: result.log.id,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { invoke };
