const express = require('express');
const loan_applicationController = require('../controller/loan_applicationController');
const Loan_application = require('../models/loan_application');

const router = express.Router();

router.get('/Member/applyloan', (req, res, next) =>{
    console.log('checking authentication status');
    try{
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is authenticated a regular member.');
            next(); 
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    }
    }, async (req, res) => {

        const user = req.user;
        res.render('./Member/applyloan', { title: 'Apply Loan', user});

    
});

router.post('/apply_loan', loan_applicationController.apply_loan );



module.exports = router;