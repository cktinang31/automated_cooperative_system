const Cbu = require('../models/cbu');
const Application = require('../models/application');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

const create_cbu = async (application_id, user_id) => {
    try {
        console.log('Inside create_cbu function');
        const application = await Application.findByPk(application_id);

        if (!application) {
            throw new Error(`Related data not found for application ID: ${application_id}`);
        }

        const amount = 1000.00;

        console.log('Creating new Cbu with Application ID:', application.application_id);
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
