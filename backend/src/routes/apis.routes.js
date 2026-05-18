const { Router } = require('express');
const apisController = require('../controllers/apis.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/', apisController.listApproved);

router.post('/', authenticate, apisController.create);
router.get('/mine/list', authenticate, apisController.listMine);
router.patch('/mine/:id', authenticate, apisController.updateMine);
router.delete('/mine/:id', authenticate, apisController.removeMine);

router.post('/:id/purchase', authenticate, apisController.purchase);
router.get('/:id', apisController.getOne);

module.exports = router;
