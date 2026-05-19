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
    AUTH_REQUIRED: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
    INVALID_TOKEN: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
    FORBIDDEN: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
    NOT_FOUND: { code: 'NOT_FOUND', message: 'Not found' },
    EMAIL_PASSWORD_REQUIRED: { code: 'EMAIL_PASSWORD_REQUIRED', message: 'Email and password are required' },
    PASSWORD_MIN_LENGTH: { code: 'PASSWORD_MIN_LENGTH', message: 'Password must be at least 6 characters' },
    INVALID_CREDENTIALS: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
    API_NOT_FOUND: { code: 'API_NOT_FOUND', message: 'API not found' },
    USER_NOT_FOUND: { code: 'USER_NOT_FOUND', message: 'User not found' },
    MISSING_API_KEY: { code: 'MISSING_API_KEY', message: 'x-api-key header is required' },
    INVALID_API_KEY: { code: 'INVALID_API_KEY', message: 'Invalid API key' },
    NO_SUBSCRIPTION: { code: 'NO_SUBSCRIPTION', message: 'No active subscription for this API' },
    QUOTA_EXHAUSTED: { code: 'QUOTA_EXHAUSTED', message: 'Quota exhausted' },
    METHOD_NOT_ALLOWED: { code: 'METHOD_NOT_ALLOWED', message: 'This API does not support the requested HTTP method' },
    RATE_LIMITED: { code: 'RATE_LIMITED', message: 'Rate limit exceeded. Try again in a moment' },
    ACTIVE_QUOTA_EXISTS: { code: 'ACTIVE_QUOTA_EXISTS', message: 'You can purchase this API again only after the current quota is exhausted' },
  },
};
