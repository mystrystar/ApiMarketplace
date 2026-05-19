function isPrismaDecimal(value) {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.toNumber === 'function' &&
    typeof value.toString === 'function' &&
    Array.isArray(value.d) &&
    typeof value.e === 'number' &&
    typeof value.s === 'number'
  );
}

function serializeForJson(value) {
  if (isPrismaDecimal(value)) {
    return value.toNumber();
  }

  if (value instanceof Date) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(serializeForJson);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeForJson(item)]),
    );
  }

  return value;
}

function normalizeJsonResponses(req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = (body) => originalJson(serializeForJson(body));
  next();
}

module.exports = { normalizeJsonResponses, serializeForJson };
