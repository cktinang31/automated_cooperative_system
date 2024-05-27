const express = require('express');
const loan_applicationController = require('../controller/loan_applicationController');
const Loan_application = require('../models/loan_application.js');

const router = express.Router();


router.post('/apply_loan', loan_applicationController.apply_loan );
router.post('/update_loan_request', loan_applicationController.update_loan_request);


module.exports = router;