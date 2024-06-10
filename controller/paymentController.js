const Loan = require ('../models/loan');
const Loan_application = require ('../models/loan_application');
const User = require ('../models/user');
const Loan_payment = require ('../models/loan_payment');
const { v4: uuidv4 } = require('uuid');
const Collected_payment = require('../models/collected_payment');




const loanpayment = async (req, res) => {
    try {
        const { amount, loan_id, application_id } = req.body;
        console.log('Request Body:', req.body);

        if (!req.session || !req.session.passport || !req.session.passport.user) {
            console.error('User ID is null or undefined');
            return res.status(401).send('User ID is null or undefined');
        }

        const user_id = req.session.passport.user;

        const loan = await Loan.findByPk(loan_id);
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

            let collectedPayment = await Collected_payment.findOne({
                where: {
                    loan_id: loanToUpdate.loan_id,
                    user_id: paymentToUpdate.User.user_id
                }
            });

            if (collectedPayment) {
                // Increment the number of payments if a record already exists
                collectedPayment.number_of_payments += 1;
                collectedPayment.timestamp = new Date();
            } else {
                // Create a new collected payment record if none exists
                collectedPayment = {
                    payment_id: payment_id,
                    loan_id: loanToUpdate.loan_id,
                    user_id: paymentToUpdate.User.user_id,
                    collectedpayment_id: uuidv4(),
                    number_of_payments: 1,
                    status: 'on-time',
                    timestamp: new Date(),
                };

                collectedPayment = await Collected_payment.create(collectedPayment);
            }

            await collectedPayment.save();

            console.log('Payment updated and collected payment saved');
            return res.redirect('/Collector/paymentnotif');
        }

       
        return res.send('Payment declined');
    } catch (error) {
        console.error('Error updating payment:', error);
        return res.status(500).send('Error updating payment');
    }
};





module.exports = {
    loanpayment,
    update_loanpayment,
};