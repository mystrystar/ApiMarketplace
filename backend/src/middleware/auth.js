const { verifyToken } = require('../utils/jwt');
const prisma = require('../lib/prisma');
const { ERRORS } = require('../constants');

async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: ERRORS.AUTH_REQUIRED });
  }

  const token = header.slice(7);

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: ERRORS.INVALID_TOKEN });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, error: ERRORS.INVALID_TOKEN });
  }
}

module.exports = { authenticate };
