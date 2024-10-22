const express = require('express');
const contentController = require('../controller/contentController');
const Content = require('../models/content');
const User = require('../models/user')

const router = express.Router();


router.post('/post_announcement', contentController.post_announcement);
router.post('/delete_content', contentController.delete_content);


module.exports = router;