const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const crypto = require('crypto');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {Pool,Client} = require ('pg')
const connectionString = 'postgressql://postgres:Ctugk3nd3s@localhost:5432/Cooperativedb'
const {Application, User, Content, Loan_application, Savings} = require('./models')
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
  resave: false,
  saveUninitialized: false
}));
 
app.use(flash());
 
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
const upload = multer({ dest: 'uploads/' });
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
 
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  failureFlash: true // Enable flash messages for authentication failures
},
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
}));
 
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
 
app.get('/inquire', (req, res) => {
  res.render('inquire', { title: 'Inquire'});
});
 
app.get('/transaction', (req, res) => {
  res.render('transaction', { title: 'Transaction History'});
});
 
app.get('/sidebar', (req, res) => {
  res.render('sidebar', { title: 'sidebar'});
});
 



 
// app.get('/mem_applications', async (req, res) => {
//   try {
//       const applications = await Application.find();
//       res.json(applications);
//   } catch (error) {
//       console.error('Error fetching applications:', error);
//       res.status(500).send('Error fetching applications');
//   } 
// });
 
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

app.post('/mem_applications/:applicationId', async (req, res) => {
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
});





app.get('/xx/:applicationId', isAuthenticated, async (req, res) => {
  const applicationId = req.params.applicationId;

  try {
      const application = await Application.findByPk(applicationId);
      if (!application) {
          return res.status(404).send('Application not found');
      }
      res.render('xx', { application, title: 'Application Details', user: req.user });
  } catch (error) {
      console.error('Error fetching application:', error);
      res.status(500).send('Error fetching application');
  }
});


app.post('/mem_application', async (req, res) => {
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
});

app.get('/Manager/request', isAuthenticated, async (req, res) => {
  const user = req.user;
  try {
    const applications = await Application.findAll();
    res.render('Manager/request', { applications, title: 'Request', user});
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).send('Error fetching requests.');
  };
});

app.get('/x', isAuthenticated, async (req, res) => {
  const user = req.user;
  try {
    const loan_applications = await Loan_application.findAll();
    const applications = await Application.findAll();
    res.render('x', { loan_applications, applications, title: 'Back-end Testing', user });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).send('Error fetching requests.');
  };
});


 
app.post('/post_Member/announcement', async (req, res) => {
  try {
    const { content_title, content } = req.body;
 
    const newContent = await Content.create({
      content_title,
      content,
      timestamp: new Date()
    });
 
    console.log('Member/Announcement:', newContent);
    res.send('Announcement Posted');
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).send('Error creating announcement.');
  }
});
 
app.get('/Manager/create_announcement', isAuthenticated, async (req, res) => {
  const user = req.user;
  res.render('Manager/create_announcement', { title: 'Create Announcement', user});
});
 
app.get('/Member/applyloan', isAuthenticated, async (req, res) => {
  const user = req.user;
  res.render('Member/applyloan', { title: 'Apply Loan', user});
});
 
app.post('/apply_loan', isAuthenticated, async (req, res) => {
  try {
    const { loan_type, amount, loan_term, interest } = req.body;
    console.log('Request Body:', req.body);
 
    const user_id = req.session.passport.user;
 
    if (!user_id) {
      console.error('User ID is null or undefined');
      return res.status(401).send('User ID is null or undefined');
    }
 
    const monthlyInterestRate = interest / 12;
 
    const number_of_payments = parseInt(loan_term.split(' ')[0]);
 
    const monthly_payment = (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, number_of_payments)) /
        (Math.pow(1 + monthlyInterestRate, number_of_payments) - 1);
 
    const newLoan_application = await Loan_application.create({
      user_id,
      loan_type,
      amount,
      loan_term,
      interest,
      monthly_payment: monthly_payment.toFixed(2),
      number_of_payments,
      application_status: 'pending',
      timestamp: new Date()
    });
    console.log('Loan Application Submitted:', newLoan_application);
    res.send('Loan Application Submitted');
  } catch (error) {
    console.error('Error submitting the application:', error);
    return res.status(500).send('Error submitting the application.');
  }
});
 
app.get('/Member/announcement', isAuthenticated, async (req, res) => {
  try {
   
    const contents = await Content.findAll({
      order: [['createdAt', 'DESC']]
    });
   
    res.render('./Member/announcement', { contents, title: 'Announcement', user });
  } catch (error) {
    console.error('Error fetching contents:', error);
    res.status(500).send('Error fetching contents.');
  }
});
 
 
app.get('/Manager/managerannouncement', isAuthenticated, async (req, res) => {
  try {
    const contents = await Content.findAll();
    res.render('Manager/managerannouncement', { contents, title: 'Announcement', user});
  } catch (error) {
    console.error('Error fetching contents:', error);
    res.status(500).send('Error fetching contents.');
  }
});
 
// app.post ('approved_loan', isAuthenticated, async (req, res) => {
//   try{
//     const Loan = await Loan.create ({
//       user_id: Loan_application.user_id,
//       loan_type: Loan_application.loan_type,
//       amount: Loan_application.amount,
//       interest: Loan_application.interest,
//       monthly_payment: Loan_application.monthly_payment,
//       number_of_payments: Loan_application.number_of_payments,
//       status: 'active'
   
//     })
//   }
// });
 
app.post('update_loan_application', isAuthenticated, async (req,res) => {
  try {
    const { application_id,
      application_status,
      user_id,
      loan_type,
      amount,
      interest,
      monthly_payment,
      number_of_payments,
       } = req.body;
 
    const updatedLoanApplication = await Loan_application.findOneAndUpdate(
      { application_id },
      { user_id },
      { loan_type },
      { amount },
      { interest },
      { monthly_payment },
      { number_of_payments },
      { application_status},
      { new: true }
    );
 
    if (!updatedLoanApplication) {
      return res.status(404).send('Loan application not found');
    }
 
   
    if (application_status === 'approved') {
 
     
      return res.redirect('/loan_success');
    } else {
      // Handle decline scenario, if needed
      return res.send('Loan application declined');
    }
  } catch (error) {
    console.error('Error updating loan status:', error);
    return res.status(500).send('Error updating loan status');
  }
})
 
 
app.get('/profile', isAuthenticated, async (req, res)  => {
  const user = req.user;
  res.render('profile', { title: 'Profile', user });
});
 
app.post('/profile/update', upload.single('profilePicture'), async (req, res) => {
  try {
    const { fullName, email } = req.body;
 
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
 
    user.fullName = fullName;
    user.email = email;
 
   
    if (req.file) {
      user.profilePicture = req.file.buffer;
    }
 
    await user.save();
 
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});
 
app.get('/profile', isAuthenticated, async (req, res) => {
  const user = req.user;
  try {
    const users = await User.findAll();
    res.render('SystemAdmin/systemadmin', { users, title: 'Back-end Testing', user });
  } catch (error) {
    
    console.error('Error fetching requests:', error);
    res.status(500).send('Error fetching requests.');
  }
});
 
 
app.get('/SystemAdmin/systemadmin', isAuthenticated, async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('SystemAdmin/systemadmin', { users: users, title: 'System Admin', user: req.user });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users.');
  }
});
 
 
 
 
app.post('update_user', isAuthenticated, async (req,res) => {
  try {
    const {
      user_id,
      fname,
      lname,
      email,
      role,
       } = req.body;
 
    const updatedUser = await User.findOneAndUpdate(
      { user_id },
      { fname },
      { lname },
      { email },
      { role },
      { new: true }
    );
 
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
 
   
    if (application_status === 'approved') {
 
     
      return res.redirect('/loan_success');
    } else {
      // Handle decline scenario, if needed
      return res.send('Loan application declined');
    }
  } catch (error) {
    console.error('Error updating loan status:', error);
    return res.status(500).send('Error updating loan status');
  }
})
 
 
// ibutang sa babaw ani inyong code (ayaw nig idelete nga line para linaw atong kinabuhi)
 
app.get('/login', (req, res) => {
  res.render('login', { title: 'Sign In / Up Form'});
});
 
app.post('/user_login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
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
     
      switch (user.role) {
        case 'admin':
          return res.redirect('/SystemAdmin/systemadmin');
        // case 'regular':
        //   return res.redirect('/regular_dashboard');
        case 'manager':
          return res.redirect('/Manager/managerannouncement');
        default:
         return res.redirect('./Member/announcement');
      }
    } else {
      console.error('Password does not match');
      return res.status(401).send('Incorrect password.');
    }
 
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in.');
  }
});


 
// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404'})
});
 
app.listen(3000, () => {
    console.log('Server running on port 3000');
});