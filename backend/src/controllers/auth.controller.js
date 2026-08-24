const prisma = require('../lib/prisma');
const { ERRORS } = require('../constants');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');

function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: ERRORS.EMAIL_PASSWORD_REQUIRED,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: ERRORS.PASSWORD_MIN_LENGTH,
      });
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    });

    const token = signToken({ userId: user.id, role: user.role });

    res.status(201).json({
      success: true,
      data: {
        user: publicUser(user),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: ERRORS.EMAIL_PASSWORD_REQUIRED,
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: ERRORS.INVALID_CREDENTIALS,
      });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: ERRORS.INVALID_CREDENTIALS,
      });
    }

    const token = signToken({ userId: user.id, role: user.role });

    res.json({
      success: true,
      data: {
        user: publicUser(user),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function demoLogin(req, res, next) {
  try {
    const { role } = req.body;
    const normalizedRole = String(role || '').toUpperCase();

    const email =
      normalizedRole === 'ADMIN'
        ? process.env.ADMIN_EMAIL
        : normalizedRole === 'USER' || normalizedRole === 'CONSUMER'
          ? process.env.CONSUMER_EMAIL
          : null;

    if (!email) {
      if (normalizedRole === 'ADMIN' || normalizedRole === 'USER' || normalizedRole === 'CONSUMER') {
        return res.status(500).json({
          success: false,
          error: {
            code: 'DEMO_LOGIN_NOT_CONFIGURED',
            message:
              'Demo login is not configured in the backend environment. Set ADMIN_EMAIL and CONSUMER_EMAIL in your local backend .env or Netlify env vars.',
          },
        });
      }

      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DEMO_ROLE',
          message: 'Demo role must be ADMIN or USER',
        },
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: ERRORS.INVALID_CREDENTIALS,
      });
    }

    const token = signToken({ userId: user.id, role: user.role });

    res.json({
      success: true,
      data: {
        user: publicUser(user),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
}

module.exports = { register, login, demoLogin, me };
