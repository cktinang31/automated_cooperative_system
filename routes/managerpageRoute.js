const express = require('express');
const User = require('../models/user');
const Content = require('../models/content');
const Loan_application = require('../models/loan_application.js')
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

router.get('/Manager/managerannouncement', (req, res, next) => {
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
        res.render('./Manager/managerannouncement', { contents, title: 'Announcement', user });
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

router.get('/Manager/req', (req,res, next) =>{
    try {
                console.log('Session ID:', req.sessionID);
                console.log('Session:', req.session);
                console.log('Authenticated:', req.isAuthenticated());
        
                if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
                    console.log('User is authenticated as manager.');
                    const user = req.user;
                    res.render('./Manager/req', { title: 'Req', user });
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

router.get('/Manager/membersdata', (req,res, next) =>{
    try {
                console.log('Session ID:', req.sessionID);
                console.log('Session:', req.session);
                console.log('Authenticated:', req.isAuthenticated());
        
                if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
                    console.log('User is authenticated as manager.');
                    const user = req.user;
                    res.render('./Manager/membersdata', { title: 'Mmembers Data', user });
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

router.get('/Manager/memberinfo', (req,res, next) =>{
    try {
                console.log('Session ID:', req.sessionID);
                console.log('Session:', req.session);
                console.log('Authenticated:', req.isAuthenticated());
        
                if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
                    console.log('User is authenticated as manager.');
                    const user = req.user;
                    res.render('./Manager/memberinfo', { title: 'Member Info', user });
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


//router.get('/Manager/req/:applicationId', async (req, res) => {
    // const applicationId = req.params.applicationId;

    // try {
    //     const application = await Application.findByPk(applicationId);
    //     if (!application) {
    //         return res.status(404).send('Application not found');
    //     }
    //     res.render('Manager/req', { application, title: 'Application Details', user: req.user });
    // } catch (error) {
    //     console.error('Error fetching application:', error);
    //     res.status(500).send('Error fetching application');
    // }
  
//   });

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

})
module.exports = router;