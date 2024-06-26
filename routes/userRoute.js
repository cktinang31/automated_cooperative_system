const express = require('express');
const userController = require('../controller/userController');


const router = express.Router();

router.post('/user_reg', userController.user_reg);
router.post('/user_login', userController.user_login);
router.post('/edit_user/:userId', userController.edit_user);
router.delete('/delete_user/:userId', userController.delete_user);
router.post('/add_user', userController.add_user);



module.exports = router;