const { Router } = require('express');
const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const apisRoutes = require('./apis.routes');
const adminRoutes = require('./admin.routes');

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/apis', apisRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
