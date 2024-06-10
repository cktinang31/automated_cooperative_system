const express = require('express');
const paymentController = require('../controller/paymentController.js');


const router = express.Router();


router.post('/loanpayment', paymentController.loanpayment );
router.post('/update_loanpayment', paymentController.update_loanpayment );


module.exports= router;