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

const create_savings = async (application_id, user_id) => {
    try {
        console.log('Inside create_savings function');
        const application = await Application.findByPk(application_id);

        if (!application) {
            throw new Error(`Related data not found for application ID: ${application_id}`);
        }

        const amount = 500.00;

        console.log('Creating new Savings with Application ID:', application.application_id);
        console.log('Creating new Savings with User ID:', user_id);

        const newSavings = await Savings.create({
            savings_id: uuidv4(),
            application_id: application.application_id,
            user_id: user_id,
            amount,
        });

        console.log('New Savings created:', newSavings);

    } catch (error) {
        console.error('Error creating Savings:', error);
        throw error;
    }
};

module.exports = {
    create_savings,
};
