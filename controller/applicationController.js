const Application = require('../models/application');


const mem_application = async (req, res) => {
    const { fname, mname, lname, date_of_birth, place_of_birth, address, email, contact } = req.body;
    const applicationDate = new Date();
    try {
       
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
        res.send('Application submitted successfully. Please wait for approval');
    } catch (error) {
  
        console.error('Error submitting the application:', error);
        res.status(500).send('Error submitting the application');
    }
};

const mem_application_update = async (req, res) => {
    const applicationId = req.params.applicationId;
    const { application_status } = req.body;

    try {
        console.log('Request Body:', req.body);
        
        const application = await Application.findByPk(applicationId);

        if (!application) {
            return res.status(404).send('Application not found');
        }

        if (application_status !== 'approved' && application_status !== 'decline') {
            return res.status(400).send('Invalid application status');
        }

        application.application_status = application_status;

        await application.save();

        console.log('Application status updated successfully:', application);
        res.send('Application status updated successfully');
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).send('Error updating application status');
    }
};


module.exports = {
    mem_application,
    mem_application_update,
};

