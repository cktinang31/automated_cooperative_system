const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {Pool,Client} = require ('pg')
const connectionString = 'postgressql://postgres:Ctugk3nd3s@localhost:5432/Cooperativedb'
const {Application, User, Content, Loan_application,Savings_Transaction, Savings} = require('./models')
const { Sequelize } = require('sequelize');
const bcrypt = require ('bcrypt')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const user = require('user');

const isAuthenticated = (req, res, next) => {
  console.log('Checking authentication status...');
  try {
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('Authenticated:', req.isAuthenticated());
    
    if (req.isAuthenticated()) {
      console.log('User is authenticated.');
      return next(); 
    } else {
      console.log('User is not authenticated. Redirecting to login page.');
      return res.redirect('/login'); 
    }
  } catch (error) {
    console.error('Error in isAuthenticated middleware:', error);
    res.status(500).send('Internal server error');
  }
};
//express app
const app = express();

const secretKey = crypto.randomBytes(64).toString('hex');

app.use(session({
  secret: secretKey, 
  re_save: false,
  saveUninitialized: false
}));


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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

// Deserialize user from session
passport.deserializeUser(async (user_id, done) => {
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      console.error('User not found in database');
      return done(null, false);
    }
    console.log('Deserialized User:', user); 
    done(null, user);
  } catch (error) {
    console.error('Error in deserialization:', error);
    done(error);
  }
});


passport.use(new LocalStrategy(
  { usernameField: 'email' }, // Specify the field name for the username/email
  async (email, password, done) => {
    try {
      // Find the user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      // Compare password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      // If user and password are correct, return the user
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));



app.get('/', (req, res) => {
    res.render('index', { title: 'Landing'});
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

// taladro backend testing (ayaw hilabti)
app.get('/savings', (req, res) => {
  res.render('savings', { title: 'Savings'});
});

app.post('/savings', async (req, res) => {
  try {
    const { deposit, content } = req.body;

    // Insert data into PostgreSQL table
    const query = 'INSERT INTO savings (deposit, content, timestamp) VALUES ($1, $2, $3) RETURNING *';
    const values = [deposit, content, new Date()];

    const result = await pool.query(query, values);
    const newSavings = result.rows[0];

    console.log('Savings:', newSavings);
    res.send('Savings saved');
  } catch (error) {
    console.error('Error creating savings:', error);
    res.status(500).send('Error creating savings.');
  }
});




app.get('/login', (req, res) => {
  res.render('login', { title: 'Login'});
});
app.get('/application', (req, res) => {
    res.render('application', { title: 'Membership Application'});
});

app.get('/system_admin', (req, res) => {
    res.render('system_admin', { title: 'Admin'});
});

app.get('/system_admin', (req, res) => {
    res.render('system_admin', { title: 'Admin'});
}); 

app.get('/inquire', (req, res) => {
  res.render('inquire', { title: 'Inquire'});
}); 

app.get('/transaction', (req, res) => {
  res.render('transaction', { title: 'Transaction History'});
}); 

app.get('/sidebar', (req, res) => {
  res.render('sidebar', { title: 'sidebar'});
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Sign In / Up Form'});
});

app.get('/system_admin', (req, res) => {
    res.render('system_admin', { title: 'Admin'});
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

app.get('/x', isAuthenticated, async (req, res) => {
  const user = req.user; 
  res.render('x', { title: 'Back-end Testing', user});
});

app.post('/post_announcement', async (req, res) => {
  try {
    const { content_title, content } = req.body;

    const newContent = await Content.create({
      content_title,
      content,
      timestamp: new Date() 
    });

    console.log('Announcement:', newContent);
    res.send('Announcement Posted');
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).send('Error creating announcement.');
  }
});

app.get('/create_announcement', isAuthenticated, async (req, res) => {
  const user = req.user;
  res.render('create_announcement', { title: 'Create_announcement', user});
});

app.get('/apply_loan', isAuthenticated, async (req, res) => {
  const user = req.user;
  res.render('apply_loan', { title: 'Apply Loan', user});
});

app.post('/apply_loan', isAuthenticated, async (req, res) => {
  try {
    const { application_id, loan_type, amount, loan_term, interest } = req.body;
    console.log('Request Body:', req.body);

    const user_id = req.session.passport.user;
  
    if (!user_id) {
      console.error('User ID is null');
      return res.status(401).send('User ID is null');
    }

    // Calculate loan term in months
    const loanTermInMonths = parseInt(loan_term.split(' ')[0]);
    
    // Calculate monthly interest rate
    const monthlyInterestRate = interest / 12;
    
    // Calculate monthly payment using formula for loan amortization
    const monthlyPayment = (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermInMonths)) /
        (Math.pow(1 + monthlyInterestRate, loanTermInMonths) - 1);

    const newLoan_application = await Loan_application.create({
      user_id,
      application_id,
      loan_type,
      amount,
      loan_term,
      interest,
      monthly_payments: monthlyPayment.toFixed(2), // Set monthly payment
      number_of_payments: loanTermInMonths, // Set number of payments
      timestamp: new Date()
    });

    console.log('Loan Application:', newLoan_application);
    res.send('Loan Application Submitted');
  } catch (error) {
    console.error('Error submitting the application:', error);
    res.status(500).send('Error submitting the application.');
  }
});
 
app.get('/announcement', isAuthenticated, async (req, res) => {
  try {
    const contents = await Content.findAll(); 
    res.render('announcement', { contents });
  } catch (error) {
    console.error('Error fetching contents:', error);
    res.status(500).send('Error fetching contents.');
  }
});

app.get('/profile', isAuthenticated, async (req, res)  => {
  const user = req.user;
  res.render('profile', { title: 'Profile', user });
});

// app.post('/profile/update', upload.single('profilePicture'), async (req, res) => {
//   try {
//     const { fullName, email } = req.body;

//     const user = await User.findByPk(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     user.fullName = fullName;
//     user.email = email;

    
//     if (req.file) {
//       user.profilePicture = req.file.buffer;
//     }

//     await user.save();

//     res.json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error updating profile' });
//   }
// });

// ibutang sa babaw ani inyong code (ayaw nig idelete nga line para linaw atong kinabuhi)

app.get('/login', (req, res) => {
  res.render('login', { title: 'Sign In / Up Form'});
});

app.post('/user_login', passport.authenticate('local', {
  successRedirect: '/announcement',
  failureRedirect: '/login',
  // failureFlash: true
}), async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login Request Body:', req.body); 
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send('User not found. Please register first.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.isLoggedIn = true; 
      req.session.user = user; 
      console.log('User Object:', req.user);
      return res.redirect('/announcement'); 
    } else {
      console.error('Password does not match'); 
      return res.status(401).send('Incorrect password.');
    }

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in.');
  }
});





// Route handler for displaying user profile
app.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = req.user;

    // Fetch user details from the database
    const userDetails = await User.findOne({ where: { email: user.email } });

    res.render('profile', { title: 'Profile', user: userDetails });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send('Error fetching user details.');
  }
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404'})
});

app.listen(3000, () => {
    console.log('Server running on port 3001');
});
