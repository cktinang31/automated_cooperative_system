const {Application, 
    Cbu, 
    Cbutransaction, 
    Loan_application, 
    Loan_payment, 
    Loan, 
    Savings, 
    Savtransaction,
    User,} = require('../models/sync');
const {create_cbu} = require ('../controller/cbuController');
const {create_savings} = require ('../controller/savingsController');


const mem_application = async (req, res) => {
    const { fname, mname, lname, date_of_birth, place_of_birth, address, email, contact } = req.body;
    const applicationDate = new Date();
    
    try {
        // Attempt to create a new application
        const newApplication = await Application.create({
            fname,
            mname,
            lname,
            date_of_birth,
            place_of_birth,
            address,
            email,
            contact,
            application_status: 'pending',
            date_sent: applicationDate,
        });

        console.log('New Application:', newApplication);

        // If successful, send a success message on the same form page
        res.render('application', { message: 'Application submitted successfully. Please wait for approval.' });

    } catch (error) {
        console.error('Error submitting the application:', error);

        // If an error occurs, send an error message on the same form page
        res.render('application', { message: 'Error submitting the application. Please try again later.' });
    }
};



const mem_application_update = async (req, res) => {
    const id = req.params.id;
    const { application_status } = req.body;

    console.log("Received ID:", id);
    console.log("Received Status:", application_status);

    if (!['approved', 'decline'].includes(application_status)) {
        console.log('Invalid application status:', application_status);
        return res.status(400).send('Invalid application status');
    }

    try {
        console.log('Request Body:', req.body);
        console.log('Application ID:', id);
        
        
        const application = await Application.findByPk( id );

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
                application_id: id,
                fname: application.fname,
                lname: application.lname,
                place_of_birth: application.place_of_birth,
                address: application.address,
                email: application.email,
                contact: application.contact,
                role: 'regular',
                timestamp: new Date(),
            };

            const newUser = await User.create(newUserDetails);

            if (!newUser) {
                throw new Error('Failed to create new user record');
            }

            console.log('New user created:', newUser.user_id);

            await create_cbu( id , newUser.user_id);
            await create_savings( id , newUser.user_id);


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
    mem_application,
    mem_application_update,
};

