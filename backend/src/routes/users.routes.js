const { Router } = require('express');
const usersController = require('../controllers/users.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/profile', usersController.getProfile);
router.patch('/profile', usersController.updateProfile);
router.get('/dashboard', usersController.getDashboard);
router.post('/subscriptions/:subscriptionId/api-key/regenerate', usersController.regenerateApiKey);
router.get('/logs', usersController.getLogs);

module.exports = router;
