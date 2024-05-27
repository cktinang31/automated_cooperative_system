const express = require('express');
const applicationController = require('../controller/applicationController');
const Application = require('../models/application');

const router = express.Router();

router.get('/application', (req, res) => {
    
    res.render('application', { title: 'Membership Application' });
  });

router.post('/mem_application', applicationController.mem_application);

router.get('/application', (req, res) => {
    
    res.render('application', { title: 'Membership Application' });
  });


router.get('/Manager/request', async (req, res) => {
    // const user = req.user;
    try {
      const applications = await Application.findAll();
      res.render('Manager/request', { applications, title: 'Request'});
    } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).send('Error fetching requests.');
    };
  });


router.get('/Manager/req/:applicationId', async (req, res) => {
  const applicationId = req.params.applicationId;

  try {
      const application = await Application.findByPk(applicationId);
      if (!application) {
          return res.status(404).send('Application not found');
      }
      res.render('Manager/req', { application, title: 'Application Details', user: req.user });
  } catch (error) {
      console.error('Error fetching application:', error);
      res.status(500).send('Error fetching application');
  }

});


router.put('/mem_application_update/:applicationId', applicationController.mem_application_update);







module.exports = router;


