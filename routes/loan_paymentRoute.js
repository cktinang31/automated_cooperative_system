const express = require('express');
const paymentController = require('../controller/paymentController.js');


const router = express.Router();


router.post('/loanpayment', paymentController.loanpayment );

module.exports= router;