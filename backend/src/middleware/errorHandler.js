function errorHandler(err, req, res, next) {
  // Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err.message);
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_RESOURCE',
        message: 'This resource already exists',
      },
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
      },
    });
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  res.status(status).json({
    success: false,
    error: {
      code: 'ERROR',
      message,
    },
  });
}

module.exports = { errorHandler };
