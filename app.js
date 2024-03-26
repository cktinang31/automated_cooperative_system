const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {Pool,Client} = require ('pg')
const connectionString = 'postgressql://postgres:Ctugk3nd3s@localhost:5432/Cooperativedb'
const {Application, User} = require('./models')
const { Sequelize } = require('sequelize');
const bcrypt = require ('bcrypt')


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

// middleware & static files
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
    const { fname, lname, email, password } = req.body;
    console.log('Request Body:', req.body); // Log request body for debugging

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).send('A user with this email is already registered in the system.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds parameter

    // Create a new user with the hashed password
    const newUser = await User.create({
      fname,
      lname,
      email,
      password: hashedPassword, // Store the hashed password in the database
    });

    console.log('New User:', newUser);
    res.send('Registered successfully. You can now log in Ka-Coop!');
  } catch (error) {
    console.error('Error registering:', error);
    res.status(500).send('Error registering.');
  }
});

app.post('/user_login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login Request Body:', req.body); // Log request body for debugging

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // If no user found with the provided email
    if (!user) {
      return res.status(404).send('User not found. Please register first.');
    }

    // Log the retrieved hashed password
    console.log('Retrieved Hashed Password:', user.password);

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Log whether the password matches or not
    console.log('Password Match:', passwordMatch);

    if (!passwordMatch) {
      console.error('Password does not match' ); // Log error when password doesn't match
      return res.status(401).send('Incorrect password.');
    }

    // If everything is okay, send a success response
    res.send('Login successful. Welcome back, ' + user.name + '!');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in.');
  }
});


app.get('/login', (req, res) => {
    res.render('login', { title: 'Sign In / Up Form'});
});

app.get('/announcement', (req, res) => {
  res.render('announcement', { title: 'Member Homepage'});
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404'})
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
