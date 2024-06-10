const Loan = require ('../models/loan');
const Loan_application = require ('../models/loan_application');
const User = require ('../models/user');
const Loan_payment = require ('../models/loan_payment');
const { v4: uuidv4 } = require('uuid');




const loanpayment = async (req, res) => {
    try {
        const { amount, loan_id, application_id } = req.body;
        console.log('Request Body:', req.body);

        const user_id = req.session.passport.user;

        if (!req.session || !req.session.passport || !req.session.passport.user) {
            console.error('User ID is null or undefined');
            return res.status(401).send('User ID is null or undefined');
        }

      

        const loan = await Loan.findByPk(loan_id)
      
        
        if (!loan) {
            console.error('Loan not found.');
            return res.status(404).send('Loan not found.');
        }

       
        const balance = loan.loan_amount - amount;

        const loanPayment = await Loan_payment.create({
            payment_id: uuidv4(),
            loan_id,
            application_id,
            user_id,
            balance,
            amount,
            status: 'pending',
            timestamp: new Date()
        });

        console.log('Payment Submitted:', loanPayment);
        res.send('Payment Submitted');
    } catch (error) {
        console.error('Error submitting the payment:', error);
        return res.status(500).send('Error submitting the payment.');
    }
};
 
const update_loanpayment = async (req, res) => {
    const payment = req.params.applicationId;
    const { application_status } = req.body; 

    try {
        console.log('Request Body:', req.body);
        console.log('Application ID:', applicationId);
        
        
        const application = await Application.findByPk(applicationId);

        if (!application) {
            console.log('Application not found');
            return res.status(404).send('Application not found');
        }

        if (application_status !== 'approved' && application_status !== 'decline') {
            console.log('Invalid application status:', application_status);
            return res.status(400).send('Invalid application status');
        }

        application.application_status = application_status;
        await application.save();

        if (application_status === 'approved') {
            const newUserDetails = {
                application_id: applicationId,
                fname: application.fname,
                lname: application.lname,
                place_of_birth: application.place_of_birth,
                address: application.address,
                email: application.email,
                contact: application.contact,
                timestamp: new Date(),
            };

            const newUser = await User.create(newUserDetails);

            if (!newUser) {
                throw new Error('Failed to create new user record');
            }

            console.log('New user created:', newUser.user_id);

            await create_cbu(applicationId, newUser.user_id);
            await create_savings(applicationId, newUser.user_id);


            return res.redirect('/Manager/request');
        } else {
            await application.destroy();
            return res.send('Membership application declined');
        }
    } catch (error) {
        console.error('Error updating application status:', error);
        return res.status(500).send('Error updating application status');
    }
};



module.exports = {
    loanpayment,
};