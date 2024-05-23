const express = require('express');
const userController = require('../controller/userController');
const User = require('../models/user');

const router = express.Router();

router.post('/user_reg', userController.user_reg);
router.post('/user_login', userController.user_login);



// router.get('/Manager/create_announcement', (req, res, next) => {
//     console.log('Checking authentication status...');
//     try {
//         console.log('Session ID:', req.sessionID);
//         console.log('Session:', req.session);
//         console.log('Authenticated:', req.isAuthenticated());

//         if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
//             console.log('User is authenticated a manager.');
//             next(); // Proceed to the route handler
//         } else {
//             console.log('User is not authenticated. Redirecting to login page.');
//             req.session.returnTo = req.originalUrl;
//             res.redirect('/login');
//         }
//     } catch (error) {
//         console.error('Error in isAuthenticated middleware:', error);
//         res.status(500).send('Internal server error');
//     }
// }, async (req, res) => {
   
//         const user = req.user;
//         res.render('./Manager/create_announcement', { title: 'Create Announcement', user });
 
// });

module.exports = router;