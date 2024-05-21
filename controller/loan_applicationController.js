const Loan_application = require ('../models/loan_application');

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

module.exports = {
    apply_loan,
}

// const mem_application = async (req, res) => {
//     const { fname, mname, lname, date_of_birth, place_of_birth, address, email, contact } = req.body;
//     const applicationDate = new Date();
//     try {
       
//         const newApplication = await Application.create({
//             fname,
//             mname,
//             lname,
//             date_of_birth,
//             place_of_birth,
//             address,
//             email,
//             contact,
//             application_status: 'pending',
//             date_sent: applicationDate,
//         });

//         console.log('New Application:', newApplication);
//         res.send('Application submitted successfully. Please wait for approval');
//     } catch (error) {
  
//         console.error('Error submitting the application:', error);
//         res.status(500).send('Error submitting the application');
//     }
