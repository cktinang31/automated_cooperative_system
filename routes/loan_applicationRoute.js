const express = require('express');
const loan_applicationController = require('../controller/loan_applicationController');
const Loan_application = require('../models/loan_application');

const router = express.Router();


router.post('/apply_loan', loan_applicationController.apply_loan );



module.exports = router;