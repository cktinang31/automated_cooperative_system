const {Application, 
    Cbu, 
    Cbutransaction, 
    Loan_application, 
    Loan_payment, 
    Loan, 
    Savings, 
    Savtransaction,
    User, VMessage} = require('../models/sync');
const { v4: uuidv4 } = require('uuid');




const loanpayment = async (req, res) => {
    try {
        const { amount, loan_id, application_id } = req.body;
        console.log('Request Body:', req.body);

        if (!req.session || !req.session.passport || !req.session.passport.user) {
            console.error('User ID is null or undefined');
            return res.status(401).send('User ID is null or undefined');
        }

        const user_id = req.session.passport.user;

       
        const loan = await Loan.findOne({
            where: { loan_id: loan_id }
        }); 

        if (!loan) {
            console.error('Loan not found.');
            return res.status(404).send('Loan not found.');
        }

      
        const loanPayment = await Loan_payment.create({
            payment_id: uuidv4(),
            loan_id,
            application_id,
            user_id,
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
    try {
        const { payment_id, status } = req.body;

        if (!payment_id || !status) {
            return res.status(400).send('Payment ID and status are required');
        }

        const paymentToUpdate = await Loan_payment.findByPk(payment_id, {
            include: [{ model: User }, { model: Loan }]
        });

        if (!paymentToUpdate) {
            console.log('Payment not found');
            return res.status(404).send('Payment not found');
        }

        if (status !== 'approved' && status !== 'decline') {
            console.log('Invalid request status:', status);
            return res.status(400).send('Invalid request status');
        }

        paymentToUpdate.status = status;
        await paymentToUpdate.save();

        if (status === 'approved') {
            const loanToUpdate = paymentToUpdate.Loan;
            loanToUpdate.balance -= paymentToUpdate.amount;
            await loanToUpdate.save();

            // Increment number_of_payments for the corresponding loan_id
            const approvedPaymentsCount = await Loan_payment.count({
                where: {
                    loan_id: paymentToUpdate.loan_id,
                    status: 'approved'
                }
            });
            paymentToUpdate.number_of_payments = approvedPaymentsCount;
            await paymentToUpdate.save();

            console.log('Payment updated and loan balance adjusted');

            return res.redirect('/Collector/paymentnotif');
        }

        console.log('New collected payment record created');
        return res.redirect('/Collector/paymentnotif');
    } catch (error) {
        console.error('Error updating payment:', error);
        return res.status(500).send('Error updating payment');
    }
};





module.exports = {
    loanpayment,
    update_loanpayment,
};