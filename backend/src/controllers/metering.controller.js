const prisma = require('../lib/prisma');
const { API_STATUS, ERRORS, SUBSCRIPTION_STATUS } = require('../constants');
const { hashApiKey } = require('../utils/apiKey');

const RATE_LIMIT_WINDOW_MS = 1000;
const RATE_LIMIT_MAX_CALLS = 10;
const rateLimitBuckets = new Map();

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

function isRateLimited(apiKeyHash) {
  const now = Date.now();
  const bucket = (rateLimitBuckets.get(apiKeyHash) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (bucket.length >= RATE_LIMIT_MAX_CALLS) {
    rateLimitBuckets.set(apiKeyHash, bucket);
    return true;
  }

  bucket.push(now);
  rateLimitBuckets.set(apiKeyHash, bucket);
  return false;
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
      where: { slug: req.params.apiSlug, status: API_STATUS.APPROVED, deletedAt: null },
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
    let keySubscription = await prisma.subscription.findUnique({
      where: { apiKeyHash },
      include: { user: true },
    });

    if (!keySubscription) {
      keySubscription = await prisma.subscription.findUnique({
        where: { apiKey },
        include: { user: true },
      });

      if (keySubscription && keySubscription.apiKeyHash !== apiKeyHash) {
        keySubscription = await prisma.subscription.update({
          where: { id: keySubscription.id },
          data: { apiKeyHash },
          include: { user: true },
        });
      }
    }

    if (api.method && api.method.toUpperCase() !== req.method.toUpperCase()) {
      await logCall({ req, startedAt, api, statusCode: 405 });
      return res.status(405).json({
        success: false,
        error: ERRORS.METHOD_NOT_ALLOWED,
      });
    }

    if (!keySubscription) {
      await logCall({ req, startedAt, api, statusCode: 401 });
      return res.status(401).json({
        success: false,
        error: ERRORS.INVALID_API_KEY,
      });
    }

    user = keySubscription.user;

    if (isRateLimited(apiKeyHash)) {
      await logCall({ req, startedAt, user, api, statusCode: 429 });
      return res.status(429).json({
        success: false,
        error: ERRORS.RATE_LIMITED,
      });
    }

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

    const result = await prisma.$transaction(async (tx) => {
      const updatedCount = await tx.subscription.updateMany({
        where: { id: subscription.id, remainingQuota: { gt: 0 } },
        data: { remainingQuota: { decrement: 1 } },
      });

      if (updatedCount.count === 0) {
        return null;
      }

      const updated = await tx.subscription.findUnique({
        where: { id: subscription.id },
        select: { remainingQuota: true },
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
