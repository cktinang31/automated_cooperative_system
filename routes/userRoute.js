const express = require('express');
const userController = require('../controller/userController');
const User = require('../models/user');

const router = express.Router();

router.post('/user_reg', userController.user_reg);
router.post('/user_login', userController.user_login);

module.exports = router;