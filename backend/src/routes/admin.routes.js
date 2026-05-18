const { Router } = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/users', adminController.listUsers);
router.patch('/users/:id/role', adminController.updateUserRole);

router.get('/apis', adminController.listApis);
router.post('/apis', adminController.createApi);
router.patch('/apis/:id', adminController.updateApi);
router.get('/apis/pending', adminController.listPendingApis);
router.patch('/apis/:id/status', adminController.updateApiStatus);
router.delete('/apis/:id', adminController.deleteApi);

router.get('/purchases', adminController.listPurchases);
router.get('/analytics', adminController.getAnalytics);
router.get('/logs', adminController.listLogs);

module.exports = router;
