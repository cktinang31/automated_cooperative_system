const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/SystemAdmin/systemadmin', (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated()) {
            console.log('User is authenticated.');
            next(); // Proceed to the route handler
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    }
}, async (req, res) => {

    try {
      const users = await User.findAll();
      res.render('SystemAdmin/systemadmin', { users: users, title: 'System Admin', user: req.user });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Error fetching users.');
    }
});
router.get('/SystemAdmin/add_user', (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated()) {
            console.log('User is authenticated.');
            next(); // Proceed to the route handler
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    }
}, async (req, res) => {

    try {
      const users = await User.findAll();
      res.render('SystemAdmin/add_user', { users: users, title: 'Add User', user: req.user });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Error fetching users.');
    }
});


module.exports= router;
