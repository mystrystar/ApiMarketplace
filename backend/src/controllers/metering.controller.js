const prisma = require('../lib/prisma');
const { API_STATUS, ERRORS, SUBSCRIPTION_STATUS } = require('../constants');

function getIpAddress(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || null;
}

function getResponseTimeMs(startedAt) {
  return Math.max(0, Date.now() - startedAt);
}

function getApiName(api, apiSlug) {
  return api?.title || api?.slug || apiSlug || 'unknown';
}

async function logCall({ req, startedAt, user, api, subscription, statusCode }) {
  return prisma.apiCallLog.create({
    data: {
      userId: user?.id || null,
      apiId: api?.id || null,
      subscriptionId: subscription?.id || null,
      apiName: getApiName(api, req.params.apiSlug),
      statusCode,
      responseTimeMs: getResponseTimeMs(startedAt),
      ipAddress: getIpAddress(req),
    },
  });
}

async function invoke(req, res, next) {
  const startedAt = Date.now();
  let user = null;
  let api = null;
  let subscription = null;

  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || typeof apiKey !== 'string') {
      await logCall({ req, startedAt, statusCode: 401 });
      return res.status(401).json({ error: ERRORS.API_KEY_REQUIRED });
    }

    api = await prisma.api.findFirst({
      where: { slug: req.params.apiSlug, status: API_STATUS.APPROVED },
    });
    if (!api) {
      await logCall({ req, startedAt, statusCode: 404 });
      return res.status(404).json({ error: ERRORS.API_NOT_FOUND });
    }

    const keySubscription = await prisma.subscription.findUnique({
      where: { apiKey },
      include: { user: true },
    });

    if (!keySubscription) {
      await logCall({ req, startedAt, api, statusCode: 401 });
      return res.status(401).json({ error: ERRORS.INVALID_API_KEY });
    }

    user = keySubscription.user;

    subscription = await prisma.subscription.findFirst({
      where: {
        id: keySubscription.id,
        apiId: api.id,
        status: SUBSCRIPTION_STATUS.ACTIVE,
      },
    });
    if (!subscription) {
      await logCall({ req, startedAt, user, api, statusCode: 403 });
      return res.status(403).json({ error: ERRORS.NO_SUBSCRIPTION });
    }

    if (subscription.remainingQuota <= 0) {
      await logCall({ req, startedAt, user, api, subscription, statusCode: 429 });
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
          apiName: getApiName(api, req.params.apiSlug),
          statusCode: 200,
          responseTimeMs: getResponseTimeMs(startedAt),
          ipAddress: getIpAddress(req),
        },
      });

      const sub = await tx.subscription.findUnique({
        where: { id: subscription.id },
        select: { remainingQuota: true },
      });

      return { log, remainingQuota: sub.remainingQuota };
    });

    if (!result) {
      await logCall({ req, startedAt, user, api, subscription, statusCode: 429 });
      return res.status(429).json({ error: ERRORS.QUOTA_EXHAUSTED });
    }

    res.json({
      success: true,
      api: api.slug,
      data: api.dummyResponse || {
        message: 'Dummy API response',
        timestamp: new Date().toISOString(),
      },
      quota: { remaining: result.remainingQuota },
      logId: result.log.id,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { invoke };
