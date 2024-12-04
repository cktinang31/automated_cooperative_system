const express = require ('express');
const savtransactionController = require ('../controller/savtransactionController');

const router = express.Router();

router.post('/savings_transaction', savtransactionController.savings_transaction);
router.post('/update_savings_request/:id', savtransactionController.update_savings_request);
router.post('/handle_transaction_submission', savtransactionController.handle_transaction_submission);


module.exports = router;