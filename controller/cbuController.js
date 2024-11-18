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

const create_cbu = async (id, user_id) => {
    try {
        console.log('Inside create_cbu function');
        const application = await Application.findByPk(id);

        if (!application) {
            throw new Error(`Related data not found for application ID: ${id}`);
        }

        const amount = 1000.00;

        console.log('Creating new Cbu with Application ID:', application.id);
        console.log('Creating new Cbu with User ID:', user_id);

        const newCbu = await Cbu.create({
            cbu_id: uuidv4(),
            application_id: application.application_id,
            user_id: user_id,
            amount,
        });

        console.log('New Cbu created:', newCbu);

    } catch (error) {
        console.error('Error creating Cbu:', error);
        throw error;
    }
};

module.exports = {
    create_cbu,
};
