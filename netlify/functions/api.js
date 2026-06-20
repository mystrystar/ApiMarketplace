const serverless = require('serverless-http');
const app = require('../../backend/src/app');

const handler = serverless(app, {
  basePath: '/.netlify/functions/api',
});

exports.handler = async (event, context) => handler(event, context);
