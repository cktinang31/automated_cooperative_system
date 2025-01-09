const express = require('express');
const convoController = require('../controller/convoController');


const router = express.Router();


router.post('/send_message', convoController.send_message );



module.exports = router;