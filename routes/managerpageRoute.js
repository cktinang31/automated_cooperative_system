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
    User,
    VMessage,} = require('../models/sync');
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
        console.log('Fetched contents:', contents);
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

router.get(['/Manager/dashboard','/Manager/managerdashboard' ],async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is regular.');
            const user = req.user;

            try {
                const contents = await Content.findAll({
                   
                    order: [['createdAt', 'DESC']], 
                    limit: 1
                    
                });

                const totalRegularUsers = await User.count({
                    where: {
                        role: 'regular' 
                    }
                });

                const applications = await Application.findAll({
                    where: { application_status: 'pending' },
                    
                });

                const savtransactions = await Savtransaction.findAll({
                    where: { status: 'pending' },
                    include: [{ model: User, as: 'User' }]  
                });

                const cbutransactions = await Cbutransaction.findAll({
                    where: { status: 'pending' },
                    include: [{ model: User, as: 'User' }]  
                });

                const loanApplications = await Loan_application.findAll({ 
                    where: { application_status: 'pending' },
                    include: [{ model: User, as: 'User' }]  
                });

                const requests = [
                    ...applications.map(app => ({ 
                        id: app.application_id,
                        fname: app.fname,
                        mname: app.mname,
                        lname: app.lname,
                        application_status: app.application_status,
                        dob: app.date_of_birth,
                        pob: app.place_of_birth,
                        address: app.address,
                        email: app.email,
                        contact: app.contact,
                        date: app.date_sent,
                        type: 'Application' 
                    })),
                
                    ...savtransactions.map(savtrans => ({ 
                        id: savtrans.savtransaction_id,
                        details: `${savtrans.User ? savtrans.User.fname : 'N/A'} ${savtrans.User ? savtrans.User.lname : ''}`, 
                        user_id: savtrans.User ? savtrans.User.user_id : null,
                        mode: savtrans.mode,
                        amount: savtrans.amount,
                        transaction_type: savtrans.transaction_type,
                        date: savtrans.date_sent,
                        type: 'Savings Transaction' 
                    })),
                
                    ...cbutransactions.map(cbutrans => ({ 
                        id: cbutrans.cbutransaction_id,
                        details: `${cbutrans.User ? cbutrans.User.fname : 'N/A'} ${cbutrans.User ? cbutrans.User.lname : ''}`, 
                        user_id: cbutrans.User ? cbutrans.User.id : null,
                        mode: cbutrans.mode,
                        amount: cbutrans.amount,
                        transaction_type: cbutrans.transaction_type,
                        date: cbutrans.date_sent,
                        type: 'CBU Transaction' 
                    })),
                
                    ...loanApplications.map(loanapp => ({ 
                        id: loanapp.application_id,
                        details: `${loanapp.User ? loanapp.User.fname : 'N/A'} ${loanapp.User ? loanapp.User.lname : ''}`, 
                        user_id: loanapp.User ? loanapp.User.user_id : null,
                        loanterm: loanapp.loan_term,
                        monthlypayment: loanapp.monthly_payment,
                        numberofpayments: loanapp.number_of_payments,
                        amount: loanapp.amount,
                        loantype: loanapp.loan_type,
                        interest: loanapp.interest,
                        date: loanapp.date_sent,
                        type: 'Loan Application' 
                    })),
                ];
                

                res.render('Manager/managerdashboard', {
                    requests,
                    totalRegularUsers,
                    contents, 
                    title: 'Dashboard', 
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
        console.error('Error in route handler:', error);
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
                { model: Savings, required: false },
                { model: Cbu, required: false },
            ]
        });
    
        if (!user || user.length === 0) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }
        console.log('Member:', user[0]);
    
        const savtransactions = await Savtransaction.findAll({
            where: {
                user_id: userId,
            },
            include: [{
                model: User,
                attributes: ['user_id'],
            }]
        });
    
        const cbutransactions = await Cbutransaction.findAll({
            where: {
                user_id: userId,
            },
            include: [{
                model: User,
                attributes: ['user_id'],
            }]
        });
    
        const loanApplications = await Loan_application.findAll({ 
            where: {
                user_id: userId,
            },
            include: [{
                model: User,
                attributes: ['user_id'],
            }]
        });
    
        // Corrected the user_id access here
        const loan_payment = await Loan_payment.findAll({
            where: {
                user_id: user[0].user_id,  
            },
            include: [{
                model: User,
                attributes: ['user_id'],
            }]
        });
    

        const transactions = [
            ...cbutransactions.map(cbu => ({
                id: cbu.cbutransaction_id,
                amount: cbu.amount,
                transaction_type: cbu.transaction_type,
                status: cbu.status,
                date: cbu.date_sent,
                type:'CBU Transactions'
            })),
            ...savtransactions.map(savings => ({
                id: savings.savtransaction_id,
                amount: savings.amount,
                transaction_type: savings.transaction_type,
                status: savings.status,
                date: savings.date_sent,
                type: 'Savings Transactions'
            })),
            ...loanApplications.map(loan_app => ({
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


        if (!user || user.length === 0) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        // Assuming user is an array of results; get the first user
        const currentUser = user[0]; 
        console.log('Member:', user[0]);

        // Log the savings and cbu data
        console.log('Savings:', user[0].Savings);
        console.log('CBU:', user[0].Cbus);

        res.render('./Manager/membersprofile', {
            user: user[0],
            savings: user[0].Savings,
            cbu: user[0].Cbus,
            transactions,
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
                    
                });

                const savtransactions = await Savtransaction.findAll({
                    where: { status: 'pending' },
                    include: [{ model: User, as: 'User' }]  
                });

                const cbutransactions = await Cbutransaction.findAll({
                    where: { status: 'pending' },
                    include: [{ model: User, as: 'User' }]  
                });

                const loanApplications = await Loan_application.findAll({ 
                    where: { application_status: 'pending' },
                    include: [{ model: User, as: 'User' }]  
                });

                const requests = [
                    ...applications.map(app => ({ 
                        id: app.application_id,
                        fname: app.fname,
                        mname: app.mname,
                        lname: app.lname,
                        application_status: app.application_status,
                        dob: app.date_of_birth,
                        pob: app.place_of_birth,
                        address: app.address,
                        email: app.email,
                        contact: app.contact,
                        date: app.date_sent,
                        type: 'Application' 
                    })),
                
                    ...savtransactions.map(savtrans => ({ 
                        id: savtrans.savtransaction_id,
                        details: `${savtrans.User ? savtrans.User.fname : 'N/A'} ${savtrans.User ? savtrans.User.lname : ''}`, 
                        user_id: savtrans.User ? savtrans.User.user_id : null,
                        mode: savtrans.mode,
                        amount: savtrans.amount,
                        transaction_type: savtrans.transaction_type,
                        date: savtrans.date_sent,
                        type: 'Savings Transaction' 
                    })),
                
                    ...cbutransactions.map(cbutrans => ({ 
                        id: cbutrans.cbutransaction_id,
                        details: `${cbutrans.User ? cbutrans.User.fname : 'N/A'} ${cbutrans.User ? cbutrans.User.lname : ''}`, 
                        user_id: cbutrans.User ? cbutrans.User.id : null,
                        mode: cbutrans.mode,
                        amount: cbutrans.amount,
                        transaction_type: cbutrans.transaction_type,
                        date: cbutrans.date_sent,
                        type: 'CBU Transaction' 
                    })),
                
                    ...loanApplications.map(loanapp => ({ 
                        id: loanapp.application_id,
                        details: `${loanapp.User ? loanapp.User.fname : 'N/A'} ${loanapp.User ? loanapp.User.lname : ''}`, 
                        user_id: loanapp.User ? loanapp.User.user_id : null,
                        loanterm: loanapp.loan_term,
                        monthlypayment: loanapp.monthly_payment,
                        numberofpayments: loanapp.number_of_payments,
                        amount: loanapp.amount,
                        loantype: loanapp.loan_type,
                        interest: loanapp.interest,
                        date: loanapp.date_sent,
                        type: 'Loan Application' 
                    })),
                ];

                console.log('Requests:', requests);
                res.render('./Manager/re_quest', {


                    requests,
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

router.get(['/Manager/managerhistory', '/Manager/transaction', '/Manager/history'], async (req, res, next) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'manager') {
            console.log('User is authenticated as a regular.');
            const user = req.user;

            try {
                const application = await Application.findAll({
                    where: {
                        application_status: ['approved', 'decline']  
                    }

                });
                const cbu_transaction = await Cbutransaction.findAll({
                    include: [{ model: User, as: 'User' }] ,
                    where: {
                        status: ['approved', 'decline'] 
                    }
                });

                
                const savings_transaction = await Savtransaction.findAll({
                    include: [{ model: User, as: 'User' }]  ,
                    where: {
                        status: ['approved', 'decline'] 
                    }
                });

                
                const loan_application = await Loan_application.findAll({
                    include: [{ model: User, as: 'User' }]  ,
                    where: {
                        application_status: ['approved', 'declined'] 
                    }
                });

                
                const transactions = [
                    ...application.map(app => ({ 
                       id: app.application_id,
                       fname: app.fname,
                       mname: app.mname,
                       lname: app.lname,
                       application_status: app.application_status,
                       dob: app.date_of_birth,
                       pob: app.place_of_birth,
                       address: app.address,
                       email: app.email,
                       contact: app.contact,
                       date: app.date_sent,
                       type: 'Application' })),
                       

                    ...savings_transaction.map(savtrans => ({ 
                        id: savtrans.savtransaction_id,
                        details: `${savtrans.User.fname} ${savtrans.User.lname}`, 
                        user_id: savtrans.User.user_id,
                        mode: savtrans.mode,
                        amount: savtrans.amount,
                        transaction_type: savtrans.transaction_type,
                        date: savtrans.date_sent,
                        type: 'Savings Transaction' })),

                    ...cbu_transaction.map(cbutrans => ({ 
                        id: cbutrans.cbutransaction_id,
                        details: `${cbutrans.User.fname} ${cbutrans.User.lname}`, 
                        user_id: cbutrans.User.id,
                        mode: cbutrans.mode,
                        amount: cbutrans.amount,
                        transaction_type: cbutrans.transaction_type,
                        date: cbutrans.date_sent,
                        type: 'CBU Transaction' })),

                    ...loan_application.map(loanapp => ({ 
                        id: loanapp.application_id,
                        details: `${loanapp.User.fname} ${loanapp.User.lname}`, 
                        user_id: loanapp.User.user_id,
                        loanterm: loanapp.loan_term,
                        monthlypayment: loanapp.monthly_payment,
                        numberofpayments: loanapp.number_of_payments,
                        amount: loanapp.amount,
                        loantype: loanapp.loan_type,
                        interest: loanapp.interest,
                        date: loanapp.date_sent,
                        type: 'Loan Application' })),
                ];

                console.log('Transactions:', transactions);

                // Render the transaction history page
                res.render('./Manager/managerhistory', {
                    transactions,
                    title: 'History',
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

router.get('/Manager/notif', async (req, res, next) => {
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
                });

                const savtransactions = await Savtransaction.findAll({
                    where: { status: 'pending' },
                    include: [{ model: User, as: 'User' }]
                });

                const cbutransactions = await Cbutransaction.findAll({
                    where: { status: 'pending' },
                    include: [{ model: User, as: 'User' }]
                });

                const loanApplications = await Loan_application.findAll({
                    where: { application_status: 'pending' },
                    include: [{ model: User, as: 'User' }]
                });

                // Rename 'VMessage' to 'vMessages' to avoid conflict
                const vMessages = await VMessage.findAll();

                const notifications = [
                    ...applications.map(app => ({
                        id: app.application_id,
                        fname: app.fname,
                        mname: app.mname,
                        lname: app.lname,
                        application_status: app.application_status,
                        dob: app.date_of_birth,
                        pob: app.place_of_birth,
                        address: app.address,
                        email: app.email,
                        contact: app.contact,
                        date: app.date_sent,
                        type: 'Application'
                    })),

                    ...savtransactions.map(savtrans => ({
                        id: savtrans.savtransaction_id,
                        details: `${savtrans.User.fname} ${savtrans.User.lname}`,
                        user_id: savtrans.User.user_id,
                        mode: savtrans.mode,
                        amount: savtrans.amount,
                        transaction_type: savtrans.transaction_type,
                        date: savtrans.date_sent,
                        type: 'Savings Transaction'
                    })),

                    ...cbutransactions.map(cbutrans => ({
                        id: cbutrans.cbutransaction_id,
                        details: `${cbutrans.User.fname} ${cbutrans.User.lname}`,
                        user_id: cbutrans.User.id,
                        mode: cbutrans.mode,
                        amount: cbutrans.amount,
                        transaction_type: cbutrans.transaction_type,
                        date: cbutrans.date_sent,
                        type: 'CBU Transaction'
                    })),

                    ...loanApplications.map(loanapp => ({
                        id: loanapp.application_id,
                        details: `${loanapp.User.fname} ${loanapp.User.lname}`,
                        user_id: loanapp.User.user_id,
                        loanterm: loanapp.loan_term,
                        monthlypayment: loanapp.monthly_payment,
                        numberofpayments: loanapp.number_of_payments,
                        amount: loanapp.amount,
                        loantype: loanapp.loan_type,
                        interest: loanapp.interest,
                        date: loanapp.date_sent,
                        type: 'Loan Application'
                    })),

                    ...vMessages.map(vMessage => ({
                        id: vMessage.vmessage_id,
                        details: [vMessage.fname, vMessage.lname],
                        email: vMessage.email,
                        contact: vMessage.contact,
                        message: vMessage.message,
                        date: vMessage.date_sent,
                    }))
                ];

                console.log('Requests:', notifications);
                res.render('./Manager/notif', {
                    notifications,
                    title: 'Notifications',
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