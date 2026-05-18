const { Router } = require('express');
const meteringController = require('../controllers/metering.controller');

const router = Router();

router.post('/:apiSlug', meteringController.invoke);

module.exports = router;
