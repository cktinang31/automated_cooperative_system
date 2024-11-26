const {loanpayment} = require ('../controller/paymentController');
const {Application, 
    Cbu, 
    Cbutransaction, 
    Loan_application, 
    Loan_payment, 
    Loan, 
    Savings, 
    Savtransaction,
    User,} = require('../models/sync');
const { v4: uuidv4 } = require('uuid');



const apply_loan = async (req, res) => {


    try {
        const { loan_type, amount, loan_term, interest } = req.body;
        console.log('Request Body:', req.body);
     
        const user_id = req.session.passport.user;
     
        if (!user_id) {
          console.error('User ID is null or undefined');
          return res.status(401).send('User ID is null or undefined');
        }
     
        const monthlyInterestRate = interest / 12;
     
        const number_of_payments = parseInt(loan_term.split(' ')[0]);
     
        const monthly_payment = (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, number_of_payments)) /
            (Math.pow(1 + monthlyInterestRate, number_of_payments) - 1);
     
        const newLoan_application = await Loan_application.create({
          application_id: uuidv4(),  
          user_id,
          loan_type,
          amount,
          loan_term,
          interest,
          monthly_payment: monthly_payment.toFixed(2),
          number_of_payments,
          application_status: 'pending',
          timestamp: new Date()
        });
        console.log('Loan Application Submitted:', newLoan_application);
        res.send('Loan Application Submitted');
      } catch (error) {
        console.error('Error submitting the application:', error);
        return res.status(500).send('Error submitting the application.');
      }
    
};

const update_loan_request = async (req, res) => {
    const id = req.params.id;
    const { application_status } = req.body;

    console.log("Received ID:", id);
    console.log("Received Status:", application_status);

    if (!['approved', 'declined'].includes(application_status)) {
        console.log('Invalid application status:', application_status);
        return res.status(400).send('Invalid application status');
    }
    try {
        const { application_id, application_status } = req.body;

        // Validate input
        if (!application_id || !application_status) {
            console.error('Application ID and status are required.');
            return res.status(400).send('Application ID and status are required');
        }

        // Find existing loan application
        const updatedLoanApplication = await Loan_application.findByPk(application_id);
        if (!updatedLoanApplication) {
            console.error('Loan application not found for ID:', application_id);
            return res.status(404).send('Loan application not found');
        }

        const user_id = updatedLoanApplication.user_id;
        updatedLoanApplication.application_status = application_status;

        if (application_status === 'approved') {
            console.log('Approving loan for application ID:', application_id);

            const monthlyPayment = parseFloat(updatedLoanApplication.monthly_payment);
            const loanTerm = parseInt(updatedLoanApplication.loan_term);
            if (isNaN(monthlyPayment) || isNaN(loanTerm)) {
                console.error('Invalid monthly payment or loan term value');
                return res.status(400).send('Invalid monthly payment or loan term value');
            }

            const total_amount = monthlyPayment * loanTerm;
            const startDate = calculateStartDate(updatedLoanApplication); 
            const endDate = calculateEndDate(updatedLoanApplication, startDate); 

            const approvedLoan = {
                loan_id: uuidv4(),
                application_id,
                user_id,
                loan_status: 'active',
                loan_type: updatedLoanApplication.loan_type,
                loan_amount: updatedLoanApplication.amount,
                total_amount,
                balance: total_amount,
                loan_term: updatedLoanApplication.loan_term,
                interest: updatedLoanApplication.interest,
                start_date: startDate,
                end_date: endDate,
                timestamp: new Date(),
            };

            console.log('Creating new loan record:', approvedLoan);

            try {
                const newLoan = await Loan.create(approvedLoan);
                if (!newLoan) {
                    throw new Error('Failed to create new Loan record');
                }
                console.log('Loan approved and record created successfully.');

                await updatedLoanApplication.save();
                
                // Return success message with the redirect
                return res.status(200).send('Loan application approved successfully.');
            } catch (err) {
                console.error('Error creating loan record:', err);
                return res.status(500).send('Failed to create new Loan record');
            }
        } else if (application_status === 'declined') {
            console.log('Declining loan application for ID:', application_id);
            await updatedLoanApplication.save();
            return res.status(200).send('Loan application declined.');
        } else {
            console.error('Invalid application status:', application_status);
            return res.status(400).send('Invalid application status');
        }

    } catch (error) {
        console.error('Error updating loan status:', error);
        return res.status(500).send('Error updating loan status');
    }
};


function calculateStartDate(loanApplication) {
    const currentDate = new Date();
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const nextMonth30thDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 30);
    return nextMonth30thDay;
}

function calculateEndDate(loanApplication, startDate) {
    const endDate = new Date(startDate);
    switch (loanApplication.loan_term) {
        case '6 months':
            endDate.setMonth(endDate.getMonth() + 6);
            break;
        case '12 months':
            endDate.setMonth(endDate.getMonth() + 12);
            break;
        case '18 months':
            endDate.setMonth(endDate.getMonth() + 18);
            break;
        case '24 months':
            endDate.setMonth(endDate.getMonth() + 24);
            break;
        default:
           
            break;
    }
    endDate.setDate(30); 
    return endDate;
};



function generateSchedule(paymentNumber) {
  const currentDate = new Date();
  const schedule = [];
  for (let i = 0; i < paymentNumber; i++) {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + i + 1, 30);
    schedule.push(nextMonth);
  }
  return schedule;
};

module.exports = {
  apply_loan,
  update_loan_request,
  calculateStartDate,
  calculateEndDate,
  generateSchedule,
};