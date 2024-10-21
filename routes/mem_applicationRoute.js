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




router.put('/mem_application_update/:id', applicationController.mem_application_update);







module.exports = router;


