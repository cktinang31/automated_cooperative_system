const Loan_application = require ('../models/loan_application');
const User = require ('../models/user');
const Loan = require ('../models/loan');
const Loan_payment = require ('../models/loan_payment');
const { v4: uuidv4 } = require('uuid');


const loanpayment = async (application_id, user_id, loan_id) => {
    try {
        const loanApplication = await Loan_application.findByPk(application_id);
        const user = await User.findByPk(user_id);

        if (!loanApplication || !user) {
            throw new Error(`Related data not found for application ID: ${application_id}`);
        }

        const balance = loanApplication.monthly_payment * loanApplication.number_of_payments;

        const newPayment = await Loan_payment.create({
            application_id: loanApplication.application_id,
            payment_id: uuidv4(),
            user_id: user.user_id,
            loan_id: loan_id,
            balance,
            amount: loanApplication.monthly_payment,
            schedule: loanApplication.start_date,
            status: 'pending',
        });

        console.log('Loan payment saved successfully for loan ID:', loan_id);

    } catch (error) {
        console.error('Error saving loan payment:', error.message);
        throw new Error('Error saving loan payment');
    }
};


module.exports = {
    loanpayment,
};