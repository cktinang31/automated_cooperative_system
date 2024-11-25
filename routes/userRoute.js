const express = require('express');
const userController = require('../controller/userController');
const multer = require('multer');
const path = require('path');

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Give the file a unique name
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/user_reg', userController.user_reg);
router.post('/user_login', userController.user_login);
router.post('/edit_user/:userId', userController.edit_user);
router.delete('/delete_user/:userId', userController.delete_user);
router.post('/add_user', userController.add_user);
router.post('/update_profile', upload.single('profilePicture'), userController.profile_update); 



module.exports = router;