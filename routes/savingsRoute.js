const express = require('express');
const savingsController = require('../controller/savingsController');

const router = express.Router();


router.post('/create_savings', savingsController.create_savings);


module.exports = router;