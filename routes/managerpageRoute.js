const express = require('express');
const User = require('../models/user');
const Content = require('../models/content');
const Loan_application = require('../models/loan_application.js');
const Application = require ('../models/application.js');
const Savtransaction = require ('../models/savtransaction');
const Cbutransaction = require ('../models/cbutransaction');
const Cbu = require('../models/cbu.js');
const Savings = require('../models/savings.js');
const Loan = require('../models/loan.js');
const Loan_payment = require('../models/loan_payment.js');
const router = express.Router();


router.get('/Manager/create_announcement', (req, res, next) => {
    console.log('Checking authentication status...');
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated a manager.');
            next(); // Proceed to the route handler
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
        res.render('./Manager/create_announcement', { title: 'Create Announcement', user });
 
});

router.get(['/Manager/managerannouncement'], (req, res, next) => {
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
        res.render('./Manager/managerannouncement', { contents, title: 'Announcement', user });
    } catch (error) {
        console.error('Error fetching contents:', error);
        res.status(500).send('Error fetching contents.');
    }
});

router.get(['/Manager/announcement', '/Manager/mannouncement'], (req, res, next) => {
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
        res.render('./Manager/mannouncement', { contents, title: 'Announcement', user });
    } catch (error) {
        console.error('Error fetching contents:', error);
        res.status(500).send('Error fetching contents.');
    }
});

router.get('/Manager/sidebarmanager', (req,res, next) =>{
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as manager.');
            const user = req.user;
            res.render('./Manager/sidebarmanager', { title: 'Sidebar', user });
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



router.get('/Manager/loanrequest', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as manager.');
            const user = req.user;

            
            try {
                const loan_applications = await Loan_application.findAll( {
                    where: {
                        application_status: 'pending'
                    },
                    include: User});
                res.render('Manager/loanrequest', { loan_applications, title: 'Loan Request', user });
            } catch (error) {
                console.error('Error fetching requests:', error);
                res.status(500).send('Error fetching requests.');
            }
        } else {
            console.log('User is not authenticated or not a manager. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).send('Internal server error');
    }
});


router.get('/Manager/loanrequestupdate/:applicationId', async (req, res, next) =>  {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as manager.');
            const user = req.user;

            
            const applicationId = req.params.applicationId;

            try {
                const loan_application = await Loan_application.findByPk(applicationId, {include: User});
                if (!loan_application) {
                    return res.status(404).send('Application not found');
                }
                res.render('Manager/loanrequestupdate', { loan_application, title: 'Request Details', user: req.user });
            } catch (error) {
                console.error('Error fetching application:', error);
                res.status(500).send('Error fetching application');
            }
        } else {
            console.log('User is not authenticated or not a manager. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).send('Internal server error');
    }

});

router.get('/Manager/_request', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);

        
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as manager.');

            try {
                const applications = await Application.findAll( {
                    where: {
                        application_status: 'pending'
                    }
                });
                res.render('Manager/request', { applications, title: 'Request' });
            } catch (error) {
                console.error('Error fetching requests:', error);
                res.status(500).send('Error fetching requests.');
            }
        } else {
            console.log('User is not authenticated or not a manager. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).send('Internal server error');
    }
});



router.get('/Manager/req/:applicationId', async (req, res, next) =>  {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as manager.');
            const user = req.user;

            
            const applicationId = req.params.applicationId;

            try {
                      const application = await Application.findByPk(applicationId);
                      if (!application) {
                          return res.status(404).send('Application not found');
                      }
                      res.render('Manager/req', { application, title: 'Application Details', user: req.user });
                  } catch (error) {
                      console.error('Error fetching application:', error);
                      res.status(500).send('Error fetching application');
                  }
                
        } else {
            console.log('User is not authenticated or not a manager. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).send('Internal server error');
    }

})

router.get('/Manager/savingsrequest', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as manager.');
            const user = req.user;

            
            try {
                const savtransaction = await Savtransaction.findAll( {
                    where: {
                        status: 'pending'
                    },
                    include: User});
                res.render('Manager/savingsrequest', { savtransaction, title: 'Savings Deposit/Withdraw Request', user });
            } catch (error) {
                console.error('Error fetching requests:', error);
                res.status(500).send('Error fetching requests.');
            }
        } else {
            console.log('User is not authenticated or not a manager. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).send('Internal server error');
    }
});


router.get('/Manager/savingsrequestupdate/:applicationId', async (req, res, next) =>  {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as manager.');
            const user = req.user;
            const applicationId = req.params.applicationId;

            try {
                const savtransaction = await Savtransaction.findByPk(applicationId, { include: User });
                if (!savtransaction) {
                    return res.status(404).send('Application not found');
                }
                res.render('Manager/savingsrequestupdate', { savtransaction, title: 'Request Details', user: req.user });
            } catch (error) {
                console.error('Error fetching application:', error);
                res.status(500).send('Error fetching request');
            }
        } else {
            console.log('User is not authenticated or not a manager. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).send('Internal server error');
    }
});



router.get('/Manager/cburequest', async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as manager.');
            const user = req.user;

            
            try {
                const cbutransaction = await Cbutransaction.findAll( {
                    where: {
                        status: 'pending'
                    },
                    include: User});
                res.render('Manager/cburequest', { cbutransaction, title: 'CBU Deposit/Withdraw Request', user });
            } catch (error) {
                console.error('Error fetching requests:', error);
                res.status(500).send('Error fetching requests.');
            }
        } else {
            console.log('User is not authenticated or not a manager. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/Manager/cburequestupdate/:applicationId', async (req, res, next) =>  {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as manager.');
            const user = req.user;
            const applicationId = req.params.applicationId;

            try {
                const cbutransaction = await Cbutransaction.findByPk(applicationId, { include: User });
                if (!cbutransaction) {
                    return res.status(404).send('Request not found');
                }
                res.render('Manager/cburequestupdate', { cbutransaction, title: 'Request Details', user: req.user });
            } catch (error) {
                console.error('Error fetching application:', error);
                res.status(500).send('Error fetching request');
            }
        } else {
            console.log('User is not authenticated or not a manager. Redirecting to login page.');
            req.session.returnTo = req.originalUrl;
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in route handler:', error);
        res.status(500).send('Internal server error');
    }
});
// router.get('/Manager/mannouncement', (req, res, next) => {
//     console.log('Checking authentication status...');
//     try {
//         console.log('Session ID:', req.sessionID);
//         console.log('Session:', req.session);
//         console.log('Authenticated:', req.isAuthenticated());

router.get(['/Manager/dashboard', '/Manager/managerdashboard/'],(req,res, next) =>{
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as manager.');
            const user = req.user;
            res.render('./Manager/managerdashboard', { title: 'Dashboard', user });
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

router.get('/Manager/membersprofile/:userId', async (req,res, next) =>{
   try {

        const userId =req.params.userId;
        console.log('request userId:', userId);
        const user = await User.findOne({
            where: { user_id: userId },
            include: [
                { model: Loan_application, required: true },
                { model: Savings, required: true },
                { model: Cbu, required: true },
                { model: Savtransaction, required: true },
                { model: Cbutransaction, required: true },
                { model: Loan, required: true },
                { model: Loan_payment, required: true },
            ]
        });

        if (!user) {
            console.log('user not found');
            return res.status(404).send('user not found');
        };

        console.log('Member:', user);
        res.render('./Manager/membersprofile', {user,
            savings: user.Savings,
            cbu: user.Cbu,
            loans: user.Loan,
            loan_application: user.Loan_application,
            savtransaction: user.Savtransaction,
            cbu_transaction: user.Cbutransaction,
            loan_payment: user.Loan_payment,
            title: 'Members Information' })

    } catch (error) {
        console.error('error fetching member:', error);
        res.status (500).send('Error fetching Member.🧛')
    } 
        
});


router.get(['/Manager/members', '/Manager/member', ],async (req,res, next) =>{
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as manager.');
            const user = req.user;

            try {
                const users = await User.findAll({
                    where: {
                        role : 'regular',
                    },
                });
                res.render('./Manager/member', { users, title: 'Members', user });
            } catch (error) {
                console.error('error fetching users:', error);
                res.status(500).send('error fetching users.');
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



router.get(['/Manager/request', '/Manager/re_quest'], (req, res) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as manager.');
            const user = req.user;
            res.render('./Manager/re_quest', { title: 'Request', user });
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



module.exports = router;