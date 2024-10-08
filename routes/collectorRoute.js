const express = require ('express');
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


router.get('/Collector/paymentnotif', async (req, res) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'collector') {
            console.log('User is authenticated as collector.');
            try {
                const loan_payment = await Loan_payment.findAll( {
                    where: {
                        status: 'pending'
                    }, include: {
                        model: User,
                        as: 'User' 
                    },
                    
                });
                res.render('Collector/paymentnotif', { loan_payment, title: 'Loan Payments' });
            } catch (error) {
                console.error('Error fetching requests:', error);
                res.status(500).send('Error fetching requests.');
            }
           
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            res.redirect('/login');
        }


    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    }
  });

 
router.get('/Collector/paymentupdate/:applicationId', async (req, res, next) =>  {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'collector') {
            console.log('User is authenticated as collector.');
            const user = req.user;

            
            const applicationId = req.params.applicationId;

            try {
                const loan_payment = await Loan_payment.findByPk(applicationId, {include: [{model: Loan}, {model:User }]});
                if (!loan_payment) {
                    return res.status(404).send('Request not found');
                }
                res.render('Collector/paymentupdate', { loan_payment, title: 'Request Details', user: req.user });
            } catch (error) {
                console.error('Error fetching application:', error);
                res.status(500).send('Error fetching application');
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


router.get('/Collector/sidebarcollector', (req, res) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated()) {
            console.log('User is authenticated.');
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    }
    res.render('Collector/sidebarcollector', { title: 'Sidebar Collector'});
  });

router.get('/Collector/inquirecol', (req, res) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated()) {
            console.log('User is authenticated.');
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    }
    res.render('Collector/inquirecol', { title: 'Inquiries'});
  });
  

router.get('/Collector/transactioncol', (req, res) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated()) {
            console.log('User is authenticated.');
        } else {
            console.log('User is not authenticated. Redirecting to login page.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.status(500).send('Internal server error');
    }
    res.render('Collector/transactioncol', { title: 'Transaction History'});
  });




router.get('/Collector/dashboard', (req, res) => {
try {
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('Authenticated:', req.isAuthenticated());

    if (req.isAuthenticated()) {
        console.log('User is authenticated.');
    } else {
        console.log('User is not authenticated. Redirecting to login page.');
        res.redirect('/login');
    }
} catch (error) {
    console.error('Error in isAuthenticated middleware:', error);
    res.status(500).send('Internal server error');
}
res.render('Collector/dashboard', { title: 'Dashboard'});
});


router.get(['/Collector/request', '/Collector/payment', '/Collector/paymentrequest'], async (req, res) => {
    try {
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('Authenticated:', req.isAuthenticated());

        if (req.isAuthenticated() && req.user && req.user.role === 'collector') {
            console.log('User is authenticated as collector.');
            const user = req.user;

            try {
                const loan_payment = await Loan_payment.findAll({
                    where: { status: 'pending' },
                    include: [{ model: User, as: 'User' }]
                });

                console.log('Requests:', loan_payment);
                res.render('./Collector/paymentrequest', { loan_payment, title: 'Payment Request', user });

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