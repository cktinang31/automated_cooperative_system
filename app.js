const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {Pool,Client} = require ('pg')
const connectionString = 'postgressql://postgres:Ctugk3nd3s@localhost:5432/Cooperativedb'
const {Application, User} = require('./models')
const { Sequelize } = require('sequelize');

 
//express app
const app = express();


const pool = new Pool({
  connectionString:connectionString
})

pool.connect()

.then(() => {
  console.log('Connected to PostgreSQL database');
 
})

.catch(err => console.error('Error connecting to PostgreSQL database', err));



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

app.get('/product', (req, res) => {
  res.render('product', { title: 'Products'});
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us'});
});

app.get('/application', (req, res) => {
    res.render('application', { title: 'Membership Application'});
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login'});
});

app.post('/mem_application', async (req, res) => {
  const { fname, mname, lname, date_of_birth, place_of_birth, address, email, contact } = req.body;
  try {


    const existingName = await Application.findOne({ fname, mname, lname });

    if (existingName) {
        return res.status(400).send('An application with this name already exists.');
    }
      const existingApplication = await Application.findOne({ $or: [{ email }, { contact }] });

      if (existingApplication) {
          return res.status(400).send('An application with this email or contact already exists.');
      }


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
      res.send('Application submitted successfully. Please wait for approval');
  } catch (error) {
      console.error('Error submitting the application:', error);
      res.status(500).send('Error submitting the application');
  }
});


app.post('/user_reg', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Request Body:', req.body); // Log request body for debugging

    const existingUser = await User.findOne({ where: { [Sequelize.Op.or]: [{ name }, { email }] } });

    if (existingUser) {
      return res.status(400).send('A user with this name/email is already registered in the system.');
    }

    // Create a new user if no existing user found
    const newUser = await User.create({
      name,
      email,
      password,
    });

    console.log('New User:', newUser);
    res.send('Registered successfully. You can now log in Ka-Coop!');
  } catch (error) {
    console.error('Error registering:', error);
    res.status(500).send('Error registering.');
  }
})


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