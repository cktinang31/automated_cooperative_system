const express = require ('express');
const cbutransactionController = require ('../controller/cbutransactionController');

const router = express.Router();

router.post('/cbu_transaction', cbutransactionController.cbu_transaction);
router.post('/update_cbu_request/:id', cbutransactionController.update_cbu_request);

module.exports = router;