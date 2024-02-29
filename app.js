const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const Application = require('./model')

 
//express app
const app = express();




// register view engine
app.set('view engine', 'ejs');

// midddlware & static files
app.use(express.static('public'));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index', { title: 'Home'});
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About'});
});

app.get('/service', (req, res) => {
    res.render('service', { title: 'Services'});
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us'});
});


app.get('/application', (req, res) => {
    res.render('application', { title: 'Membership Application'});
}); 

app.post('/mem_application', async (req, res) => {
    const { fname, mname, lname, date_of_birth, place_of_birth, address, email, contact } = req.body;
    try {
      // Create a new user using the User model
      const newApplication = await Application.create({
        fname,
        mname,
        lname,
        date_of_birth,
        place_of_birth,
        address,
        email,
        contact,
      });
      console.log('New Application:', newApplication);
      res.send('Application submitted successfully. Please  wait for approval');
    } catch (error) {
      console.error('Error submitting the application:', error);
      res.status(500).send('Error submitting the application');
    }
  });


app.get('/login', (req, res) => {
    res.render('login', { title: 'Sign In / Up Form'});
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404'})
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});