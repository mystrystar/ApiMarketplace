const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const v1Routes = require('./routes/v1.routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API Marketplace backend',
    docs: 'Use /api/health, POST /v1/:apiSlug with x-api-key for metering',
  });
});

app.use('/api', routes);
app.use('/v1', v1Routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

module.exports = app;
