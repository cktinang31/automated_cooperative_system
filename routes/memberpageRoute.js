const express = require('express');
const Content = require('../models/content');
const {Application, 
    Cbu, 
    Cbutransaction,
    transaction_history, 
    Loan_application, 
    Loan_payment, 
    Loan, 
    Savings, 
    Savtransaction,
    User,} = require('../models/sync');
 
 
 
const { title } = require('process');
const { Op } = require('sequelize');
 
 
const router = express.Router();

 //Member announcement route

router.get('/Member/announcement', (req, res, next) => {
    console.log('Checking authentication status...');
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());
 
        if (req.isAuthenticated()) {
            console.log('User is authenticated.');
            next(); 
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

 //Member sidebar route

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
 
//Member inquire route

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


router.get(['/Member/transaction_history', '/Member/transaction', '/Member/history'], async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is authenticated as a regular.');
            const user = req.user;

            try {
                // Fetch CBU transactions
                const cbu_transaction = await Cbutransaction.findAll({
                    where: {
                        user_id: user.user_id,
                    },
                    include: [{
                        model: User,
                        attributes: ['user_id'],
                    }],
                });

                // Fetch Savings transactions
                const savings_transaction = await Savtransaction.findAll({
                    where: {
                        user_id: user.user_id,
                    },
                    include: [{
                        model: User,
                        attributes: ['user_id'],
                    }],
                });

                // Fetch Loan applications
                const loan_application = await Loan_application.findAll({
                    where: {
                        user_id: user.user_id,
                    },
                    include: [{
                        model: User,
                        attributes: ['user_id'],
                    }],
                });

                // Fetch Loan payments (Fixed typo here)
                const loan_payment = await Loan_payment.findAll({
                    where: {
                        user_id: user.user_id,
                    },
                    include: [{
                        model: User,
                        attributes: ['user_id'],
                    }]
                });

                // Combine all transactions into a single array
                const transactions = [
                    ...cbu_transaction.map(cbu => ({
                        id: cbu.cbutransaction_id,
                        amount: cbu.amount,
                        transaction_type: cbu.transaction_type,
                        status: cbu.status,
                        date: cbu.date_sent,
                        type:'CBU Transactions'
                    })),
                    ...savings_transaction.map(savings => ({
                        id: savings.savtransaction_id,
                        amount: savings.amount,
                        transaction_type: savings.transaction_type,
                        status: savings.status,
                        date: savings.date_sent,
                        type: 'Savings Transactions'
                    })),
                    ...loan_application.map(loan_app => ({
                        id: loan_app.application_id,
                        amount: loan_app.amount,
                        status: loan_app.application_status,
                        date: loan_app.date_sent,
                        type: 'Loan Application'
                    })),
                    ...loan_payment.map(payment => ({
                        id: payment.payment_id,
                        amount: payment.amount,
                        status: payment.status,
                        date: payment.date_sent,
                        type: 'Loan Payment'
                    })),
                ];

                console.log('Transactions:', transactions);

                // Render the transaction history page
                res.render('./Member/transaction_history', {
                    transactions,
                    title: 'Request',
                    user
                });

            } catch (error) {
                console.error('Error fetching transactions:', error);
                res.status(500).send('Error fetching transactions.');
            }

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
                        loan_status : 'active',
                        user_id: user.user_id
                      },
                      include: [{
                        model: User,
                        attributes: ['user_id'],
                      }],
                    });
                res.render('Member/cbu_deposit', { Cbu, title: 'cbu_deposit', user });
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
//cbu route

router.get('/Member/cbu', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());
 
       
        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is authenticated as a regular.');
 
          
            const cbu = await Cbu.findAll({
                where: {
                    user_id: req.user.user_id  
                },
                include: [{
                    model: User,
                    attributes: ['user_id'],  
                }]
            });
 
           
            res.render('./Member/cbu', { title: 'Cbu', user: req.user, cbu });
 
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
 //sidebar route

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

 //Manager membersinfo route

router.get('/Manager/membersinfo', (req, res) => {
    res.render('Manager/memberinfo', { title: 'Member'});
  });

 //dashboard route

  router.get('/Member/dashboard', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is regular.');
            const user = req.user;

            try {
                const contents = await Content.findAll({
                   
                    order: [['createdAt', 'DESC']], 
                    limit: 1
                    
                });
                
                const savings = await Savings.findAll({
                    where: {
                        user_id: user.user_id,
                    }
                });

               
                //loans
                const loans = await Loan.findAll({
                    where: {
                        user_id: user.user_id,
                    },
                        order: [
                            ['timestamp', 'DESC'], // Order by 'timestamp' in descending order
                        ],
                        limit: 1, 
                        
                        
                    
                });
                //cbu
                const cbu = await Cbu.findAll({
                    where: {
                        user_id: user.user_id,
                    },
                });

                

                res.render('Member/dashboard', {
                    loans, 
                    contents, 
                    savings, 
                    cbu,  
                    title: 'Dashboard', 
                    user 
                });
                console.log(savings);
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

 
router.get('/Member/loans', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());
 
       
        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is authenticated as a regular.');
 
          //loan 
            const loans = await Loan.findAll({
                where: {
                    loan_status: 'active',
                    user_id: req.user.user_id  
                },
                include: [{
                    model: User,
                    attributes: ['user_id'],  
                }]
            });
 
           
            res.render('./Member/loans', { title: 'Loans', user: req.user, loans });
 
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
 
router.get('/Member/funds', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());
 
        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is authenticated as a regular user.');

            // Fetch the savings for the authenticated user
            const savings = await Savings.findAll({
                where: { user_id: req.user.user_id },
                include: [{
                    model: User,
                    attributes: ['user_id'],  
                }]
            }) || [];
            
            const cbu = await Cbu.findAll({
                where: { user_id: req.user.user_id },
                include: [{
                    model: User,
                    attributes: ['user_id'],  
                }]
            }) || [];
            

            const user = req.user;
            res.render('./Member/funds', { cbu, savings, title: 'Funds', user });
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl; // Store the return URL
            res.redirect('/login'); // Redirect to the login page
        }
    } catch (error) {
        console.error('Error in /Member/funds route:', error);
        res.status(500).send('Internal server error'); // Send a 500 error if something goes wrong
    }
});

router.get('/Member/notif', async (req, res, next) => {
    try {
        // Checking session details (could be removed in production)
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        // Ensure the user is authenticated and has a regular role
        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is authenticated as regular.');

            const user = req.user;

            // Helper function to fetch transactions
            const findTransactions = async (model, userId, statuses = [], statusField = 'status') => {
                const whereClause = { user_id: userId };
                whereClause[statusField] = statuses;

                return model.findAll({
                    where: whereClause,
                    include: [{ model: User, attributes: ['user_id'] }],
                });
            };

            try {
                // Fetching transactions in parallel
                const [cbuTransaction, savingsTransaction, loanApplication, loanPayment] = await Promise.all([
                    findTransactions(Cbutransaction, user.user_id, ['approved', 'decline']),
                    findTransactions(Savtransaction, user.user_id, ['approved', 'decline']),
                    findTransactions(Loan_application, user.user_id, ['approved', 'decline'], 'application_status'),
                    findTransactions(Loan_payment, user.user_id, ['approved', 'decline'])
                ]);

                // Combine all transactions into a single array of notifications
                const notifications = [
                    ...cbuTransaction.map(cbu => ({
                        id: cbu.cbutransaction_id,
                        amount: cbu.amount,
                        transaction_type: cbu.transaction_type,
                        status: cbu.status,
                        date: cbu.date_sent,
                        type: 'CBU Transactions'
                    })),
                    ...savingsTransaction.map(savings => ({
                        id: savings.savtransaction_id,
                        amount: savings.amount,
                        transaction_type: savings.transaction_type,
                        status: savings.status,
                        date: savings.date_sent,
                        type: 'Savings Transactions'
                    })),
                    ...loanApplication.map(loanApp => ({
                        id: loanApp.application_id,
                        amount: loanApp.amount,
                        status: loanApp.application_status,
                        date: loanApp.date_sent,
                        type: 'Loan Application'
                    })),
                    ...loanPayment.map(payment => ({
                        id: payment.payment_id,
                        amount: payment.amount,
                        status: payment.status,
                        date: payment.date_sent,
                        type: 'Loan Payment'
                    }))
                ];

                console.log('Notifications:', notifications);

                
                notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

                // Render the notifications to the page
                res.render('Member/notif', { notifications, user, title: 'Notifications' });
            } catch (error) {
                console.error('Error fetching transactions:', error);
                res.status(500).send('Error fetching transactions.');
            }
        } else {
            // If user is not authenticated, redirect to login page
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/Member/profile', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is authenticated as a regular user.');

           
            const user = await User.findOne({ where: { user_id: req.user.user_id } });

            if (!user) {
                console.log('User not found.');
                return res.status(404).send('User not found');
            }

            
            res.render('./Member/profile', { 
                title: 'Profile',
                user: user 
            });
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl; 
            res.redirect('/login'); 
        }
    } catch (error) {
        console.error('Error in /Member/profile route:', error);
        res.status(500).send('Internal server error'); 
    }
});

router.get('/Member/xxx', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());
        
        if (req.isAuthenticated() && req.user && req.user.role === 'regular') {
            console.log('User is authenticated as a regular user.');

            // Fetch the savings for the authenticated user
            const savings = await Savings.findAll({
                where: { user_id: req.user.user_id },
                include: [ {
                    model: User,
                    attributes: ['user_id'],  
                }]
            }) || [];

            // Calculate 2% monthly growth for each saving
            const months = 12; // Example: For the next 12 months
            savings.forEach(saving => {
                saving.monthlyGrowth = []; // Initialize the monthlyGrowth array
                let currentAmount = saving.amount;
                for (let i = 1; i <= months; i++) {
                    currentAmount += currentAmount * 0.02;  // 2% growth
                    saving.monthlyGrowth.push(currentAmount.toFixed(2));  // Add to the monthly growth array
                }
                console.log(`Saving ID: ${saving.savings_id}, Monthly Growth:`, saving.monthlyGrowth);
            });

            const cbu = await Cbu.findAll({
                where: { user_id: req.user.user_id },
                include: [{
                    model: User,
                    attributes: ['user_id'],  
                }]
            }) || [];

            const user = req.user;
            
            // Pass the `months` variable along with others to the template
            res.render('./Member/fundxxx', { cbu, savings, months, title: 'Funds', user });
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            req.session.returnTo = req.originalUrl; // Store the return URL
            res.redirect('/login'); // Redirect to the login page
        }
    } catch (error) {
        console.error('Error in /Member/fundxxx route:', error);
        res.status(500).send('Internal server error'); // Send a 500 error if something goes wrong
    }
});


module.exports = router;