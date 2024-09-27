const express = require('express');
const Content = require('../models/content');
const {Application, 
    Cbu, 
    Cbutransaction, 
    Loan_application, 
    Loan_payment, 
    Loan, 
    Savings, 
    Savtransaction,
    User,} = require('../models/sync');
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

router.get('/Manager/membersprofile/:userId', async (req, res, next) => {
    const userId = req.params.userId;
    console.log('Request userId:', userId);

    try {
        const user = await User.findAll({
            where: { user_id: userId },
            include: [
                { model: Loan_application, required: false },
                { model: Savings, required: false },
                { model: Cbu, required: false },
                { model: Savtransaction, required: false },
                { model: Cbutransaction, required: false },
                { model: Loan, required: false },
                { model: Loan_payment, required: false },
            ]
        });

        if (!user || user.length === 0) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        // Assuming user is an array of results; get the first user
        const currentUser = user[0]; 
        console.log('Member:', currentUser);

        // Log the savings and cbu data
        console.log('Savings:', currentUser.Savings);
        console.log('CBU:', currentUser.Cbus);

        res.render('./Manager/membersprofile', {
            user: currentUser,
            savings: currentUser.Savings,
            cbu: currentUser.Cbus,
            loans: currentUser.Loans,
            loan_application: currentUser.Loan_applications,
            savtransaction: currentUser.Savtransactions,
            cbu_transaction: currentUser.Cbutransactions,
            loan_payment: currentUser.Loan_payments,
            title: 'Members Information'
        });
    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).send('Error fetching member data.');
    }
});





router.get(['/Manager/request', '/Manager/re_quest'], async (req, res) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as manager.');
            const user = req.user;

            try {
                const applications = await Application.findAll({
                    where: { application_status: 'pending' },
                    include: User
                });

                const savtransactions = await Savtransaction.findAll({
                    where: { status: 'pending' },
                    include: User
                });

                const cbutransactions = await Cbutransaction.findAll({
                    where: { status: 'pending' },
                    include: User
                });

                const loanApplications = await Loan_application.findAll({ 
                    where: { application_status: 'pending' },
                    include: User
                });

               
                res.render('./Manager/re_quest', {
                    applications,
                    loanApplications,
                    savtransactions,
                    cbutransactions,
                    title: 'Request',
                    user
                });

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
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    }
});



module.exports = router;