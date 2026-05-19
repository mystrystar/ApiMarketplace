module.exports = {
  API_STATUS: {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
  },
  SUBSCRIPTION_STATUS: {
    ACTIVE: 'ACTIVE',
  },
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 50,
  },
  ERRORS: {
    AUTH_REQUIRED: 'Authentication required',
    INVALID_TOKEN: 'Invalid or expired token',
    FORBIDDEN: 'Insufficient permissions',
    NOT_FOUND: 'Not found',
    EMAIL_PASSWORD_REQUIRED: 'Email and password are required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
    INVALID_CREDENTIALS: 'Invalid credentials',
    API_NOT_FOUND: 'API not found',
    USER_NOT_FOUND: 'User not found',
    API_KEY_REQUIRED: 'x-api-key header is required',
    INVALID_API_KEY: 'Invalid API key',
    NO_SUBSCRIPTION: 'No active subscription for this API',
    QUOTA_EXHAUSTED: 'Quota exhausted',
    ACTIVE_QUOTA_EXISTS: 'You can purchase this API again only after the current quota is exhausted',
  },
};
