const { ERRORS } = require('../constants');

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: ERRORS.AUTH_REQUIRED });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: ERRORS.FORBIDDEN });
    }

    next();
  };
}

module.exports = { requireRole };
