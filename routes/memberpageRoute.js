const express = require('express');
const User = require('../models/user');
const Content = require('../models/content');
const Loan_payment = require('../models/loan_payment');
const Loan = require('../models/loan');
const Loan_application = require ('../models/loan_application');
const Savings = require ('../models/savings');
const Cbu = require('../models/cbu');
const { title } = require('process');


const router = express.Router();

router.get('/Member/announcement', (req, res, next) => {
    console.log('Checking authentication status...');
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
        const contents = await Content.findAll({
            order: [['createdAt', 'DESC']]
        });
        const user = req.user;
        res.render('./Member/announcement', { contents, title: 'Announcement', user });
    } catch (error) {
        console.error('Error fetching contents:', error);
        res.status(500).send('Error fetching contents.');
    }
});

router.get('/Member/sidebar', (req,res, next) =>{
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is authenticated a regular.');
            const user = req.user;
            res.render('./Member/sidebar', { title: 'Sidebar', user });
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    }
        
});

router.get('/Member/inquire', (req,res, next) =>{
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is authenticated a regular.');
            const user = req.user;
            res.render('./Member/inquire', { title: 'Inquire', user });
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    }
        
});

router.get('/Member/transaction', (req,res, next) =>{
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is authenticated a regular.');
            const user = req.user;
            res.render('./Member/transaction', { title: 'Transaction', user });
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    } 
});

router.get('/Member/transaction', (req,res, next) =>{
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is authenticated a regular.');
            const user = req.user;
            res.render('./Member/transaction', { title: 'Transaction', user });
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    }
        
});

router.get('/Member/dividend_deposit', (req,res, next) =>{
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is authenticated a regular.');
            const user = req.user;
            res.render('./Member/dividend_deposit', { title: 'Deposit', user });
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    }
        
});

router.get('/Member/apply_loan', (req, res, next) =>{
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
        res.render('./Member/apply_loan', { title: 'Apply Loan', user});

    
});


router.get('/Member/currentloan', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is regular.');
            const user = req.user;

            try {
                const loans = await Loan.findAll( {
                    where: {
                        loan_status : 'active',
                        user_id: user.user_id
                      },
                      include: [{
                        model: User, 
                        attributes: ['user_id'], 
                      }],
                    });
                res.render('Member/currentloan', { loans, title: 'Current Loan', user });
            } catch (error) {
                console.error('Error fetching requests:', error);
                res.status(500).send('Error fetching requests.');
            }
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/Member/regular_loan/:loanId', async (req, res, next) => {
    try {
        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            const user = req.user;
            const loanId = req.params.loanId;
            console.log('Requested loanId:', loanId); 

            try {
                const loan = await Loan.findOne({
                    where: { loan_id: loanId },
                    include: [
                        { model: User, required: true },
                        { model: Loan_application, required: true },
                    ]
                });

                const loan_payment = await Loan_payment.findAll({
                    where: { loan_id: loanId },
                    include: [
                        { model: User, required: true },
                        { model: Loan, required: true },
                    ]
                });

                if (!loan) {
                    console.log('loan not found.');
                    return res.status(404).send('loan not found.');
                };

                console.log('Loan :', loan);
                
                res.render('Member/regular_loan', { loan, loan_payment, title: 'Loan Payment Details', user: req.user });
            } catch (error) {
                console.error('Error fetching loan ', error);
                res.status(500).send('Error fetching loan ');
            }
        } else {
            console.log('User is not authenticated.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).send('Internal server error.');
    }
});

router.get('/Member/savings_deposit', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is regular.');
            const user = req.user;

            
            try {
                const savings = await Savings.findAll({
                    where: {
                      user_id: user.user_id,
                    },
                    include: [{
                      model: User, 
                      attributes: ['user_id'], 
                    }],
                  });
                  
                res.render('Member/savings_deposit', { savings, title: 'Current Loan', user });
            } catch (error) {
                console.error('Error fetching requests:', error);
                res.status(500).send('Error fetching requests.');
            }
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/Member/cbu_deposit', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is regular.');
            const user = req.user;

            
            try {
                const cbu = await Cbu.findAll( {
                    where: {
                        user_id: user.user_id,
                    },
                });
                res.render('Member/cbu_deposit', { cbu, title: 'Current Loan', user });
            } catch (error) {
                console.error('Error fetching requests:', error);
                res.status(500).send('Error fetching requests.');
            }
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).send('Internal server error');
    }
});


router.get('/Member/sidebar', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is regular.');
            const user = req.user;

            try {
                const userData = await User.findOne({
                    where: {
                        user_id: user.user_id,
                    },
                });
                res.render('Member/sidebar', { title: 'Sidebar', user: userData });
            } catch (error) {
                console.error('Error fetching user data:', error);
                res.status(500).send('Error fetching user data.');
            }
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/Manager/membersinfo', (req, res) => {
    res.render('Manager/memberinfo', { title: 'Member'});
  });
  
module.exports = router;