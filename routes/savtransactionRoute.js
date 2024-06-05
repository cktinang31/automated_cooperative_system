const express = require ('express');
const savtransactionController = require ('../controller/savtransactionController');

const router = express.Router();

router.post('/savings_transaction', savtransactionController.savings_transaction);

module.exports = router;