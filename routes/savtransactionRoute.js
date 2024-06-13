const express = require ('express');
const savtransactionController = require ('../controller/savtransactionController');

const router = express.Router();

router.post('/savings_transaction', savtransactionController.savings_transaction);
router.post('/update_savings_request/:savtransaction_id', savtransactionController.update_savings_request);

module.exports = router;