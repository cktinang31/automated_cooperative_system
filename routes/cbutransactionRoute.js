const express = require ('express');
const cbutransactionController = require ('../controller/cbutransactionController');

const router = express.Router();

router.post('/cbu_transaction', cbutransactionController.cbu_transaction);

module.exports = router;