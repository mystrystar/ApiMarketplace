const prisma = require('../lib/prisma');
const { API_STATUS, ERRORS, SUBSCRIPTION_STATUS } = require('../constants');
const { hashApiKey } = require('../utils/apiKey');

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
      return res.status(401).json({
        success: false,
        error: ERRORS.MISSING_API_KEY,
      });
    }

    api = await prisma.api.findFirst({
      where: { slug: req.params.apiSlug, status: API_STATUS.APPROVED },
    });
    if (!api) {
      await logCall({ req, startedAt, statusCode: 404 });
      return res.status(404).json({
        success: false,
        error: ERRORS.API_NOT_FOUND,
      });
    }

    // Hash the API key before database lookup
    const apiKeyHash = hashApiKey(apiKey);
    const keySubscription = await prisma.subscription.findUnique({
      where: { apiKeyHash },
      include: { user: true },
    });

    if (!keySubscription) {
      await logCall({ req, startedAt, api, statusCode: 401 });
      return res.status(401).json({
        success: false,
        error: ERRORS.INVALID_API_KEY,
      });
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
      return res.status(403).json({
        success: false,
        error: ERRORS.NO_SUBSCRIPTION,
      });
    }

    if (subscription.remainingQuota <= 0) {
      await logCall({ req, startedAt, user, api, subscription, statusCode: 429 });
      return res.status(429).json({
        success: false,
        error: ERRORS.QUOTA_EXHAUSTED,
      });
    }

    // Execute quota decrement with FOR UPDATE lock inside transaction
    const result = await prisma.$transaction(async (tx) => {
      // Acquire row-level lock with FOR UPDATE
      const locked = await tx.$queryRaw`
        SELECT id, "remainingQuota" FROM "Subscription" 
        WHERE id = ${subscription.id}
        FOR UPDATE
      `;

      if (!locked || locked.length === 0 || locked[0].remainingQuota <= 0) {
        return null;
      }

      // Safe to decrement now
      const updated = await tx.subscription.update({
        where: { id: subscription.id },
        data: { remainingQuota: { decrement: 1 } },
      });

      // Log the successful call
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

      return { log, remainingQuota: updated.remainingQuota };
    });

    if (!result) {
      await logCall({ req, startedAt, user, api, subscription, statusCode: 429 });
      return res.status(429).json({
        success: false,
        error: ERRORS.QUOTA_EXHAUSTED,
      });
    }

    res.json({
      success: true,
      data: api.dummyResponse || {
        message: 'Dummy API response',
        timestamp: new Date().toISOString(),
      },
      meta: {
        quotaRemaining: result.remainingQuota,
        logId: result.log.id,
        apiSlug: api.slug,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { invoke };
