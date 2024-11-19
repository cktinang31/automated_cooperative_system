const express = require('express');
const vmessageController = require('../controller/vmessageController');

const router = express.Router();


router.post('/messages', vmessageController.messages);


module.exports = router;