const express = require('express');
const cbuController = require('../controller/cbuController');

const router = express.Router();


router.post('/create_cbu', cbuController.create_cbu);


module.exports = router;