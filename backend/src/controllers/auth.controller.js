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

async function me(req, res) {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
}

module.exports = { register, login, me };
