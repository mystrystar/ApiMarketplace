const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: Number(process.env.PORT) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};
