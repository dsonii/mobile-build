const express = require('express');
const bcrypt = require('bcryptjs');

const negotiationController = require('../controllers/negotiation');
const router = express.Router();

router.post('/', negotiationController.create);
router.get('/', negotiationController.get);

module.exports = router;