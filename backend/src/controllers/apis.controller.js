const prisma = require('../lib/prisma');
const { API_PUBLIC_SELECT } = require('../constants/apiSelect');
const { API_STATUS, ERRORS, SUBSCRIPTION_STATUS } = require('../constants');
const { toSlug } = require('../utils/slug');
const { generateApiKey, hashApiKey } = require('../utils/apiKey');

async function listApproved(req, res, next) {
  try {
    const { category, search } = req.query;
    const where = { status: API_STATUS.APPROVED };

    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const apis = await prisma.api.findMany({
      where,
      select: API_PUBLIC_SELECT,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: { apis },
    });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const api = await prisma.api.findFirst({
      where: { id: req.params.id, status: API_STATUS.APPROVED },
      select: API_PUBLIC_SELECT,
    });

    if (!api) {
      return res.status(404).json({
        success: false,
        error: ERRORS.API_NOT_FOUND,
      });
    }

    res.json({
      success: true,
      data: { api },
    });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { title, description, baseUrl, category, pricePerCall, slug, defaultQuota } =
      req.body;

    if (!title || !baseUrl) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Title and baseUrl are required' },
      });
    }

    const apiSlug = slug ? toSlug(slug) : toSlug(title);
    if (!apiSlug) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'A valid slug is required' },
      });
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
        providerId: req.user.id,
      },
      select: API_PUBLIC_SELECT,
    });

    res.status(201).json({
      success: true,
      data: { api },
    });
  } catch (err) {
    next(err);
  }
}

async function listMine(req, res, next) {
  try {
    const apis = await prisma.api.findMany({
      where: { providerId: req.user.id },
      select: API_PUBLIC_SELECT,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: { apis },
    });
  } catch (err) {
    next(err);
  }
}

async function updateMine(req, res, next) {
  try {
    const existing = await prisma.api.findFirst({
      where: { id: req.params.id, providerId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: ERRORS.API_NOT_FOUND,
      });
    }

    const { title, description, baseUrl, category, pricePerCall } = req.body;

    const api = await prisma.api.update({
      where: { id: existing.id },
      data: {
        title,
        description,
        baseUrl,
        category,
        pricePerCall,
        status: API_STATUS.PENDING,
      },
      select: API_PUBLIC_SELECT,
    });

    res.json({
      success: true,
      data: { api },
    });
  } catch (err) {
    next(err);
  }
}

async function removeMine(req, res, next) {
  try {
    const existing = await prisma.api.findFirst({
      where: { id: req.params.id, providerId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: ERRORS.API_NOT_FOUND,
      });
    }

    await prisma.api.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function purchase(req, res, next) {
  try {
    const api = await prisma.api.findFirst({
      where: { id: req.params.id, status: API_STATUS.APPROVED },
    });

    if (!api) {
      return res.status(404).json({
        success: false,
        error: ERRORS.API_NOT_FOUND,
      });
    }

    const amount = api.pricePerCall * api.defaultQuota;
    const existing = await prisma.subscription.findUnique({
      where: { userId_apiId: { userId: req.user.id, apiId: api.id } },
    });

    if (existing?.status === SUBSCRIPTION_STATUS.ACTIVE && existing.remainingQuota > 0) {
      return res.status(409).json({
        success: false,
        error: ERRORS.ACTIVE_QUOTA_EXISTS,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const purchaseRecord = await tx.purchase.create({
        data: {
          userId: req.user.id,
          apiId: api.id,
          amount,
          quota: api.defaultQuota,
        },
      });

      let subscription;
      if (existing) {
        subscription = await tx.subscription.update({
          where: { id: existing.id },
          data: {
            totalQuota: { increment: api.defaultQuota },
            remainingQuota: { increment: api.defaultQuota },
            status: SUBSCRIPTION_STATUS.ACTIVE,
          },
        });
      } else {
        const apiKey = generateApiKey();
        const apiKeyHash = hashApiKey(apiKey);
        subscription = await tx.subscription.create({
          data: {
            userId: req.user.id,
            apiId: api.id,
            purchaseId: purchaseRecord.id,
            apiKey,
            apiKeyHash,
            totalQuota: api.defaultQuota,
            remainingQuota: api.defaultQuota,
          },
        });
      }

      return { purchase: purchaseRecord, subscription };
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listApproved,
  getOne,
  create,
  listMine,
  updateMine,
  removeMine,
  purchase,
};
