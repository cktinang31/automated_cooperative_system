const express = require('express');
const savingsController = require('../controller/savingsController');

const router = express.Router();


router.post('/create_savings', savingsController.create_savings);
router.post('/create_savings', savingsController.update_savings_amount);


module.exports = router;