const crypto = require('crypto');

function generateApiKey() {
  return `ak_${crypto.randomBytes(24).toString('hex')}`;
}

function hashApiKey(apiKey) {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

module.exports = { generateApiKey, hashApiKey };
