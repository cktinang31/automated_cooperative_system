const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const crypto = require('crypto');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {Pool,Client} = require ('pg')
const connectionString = 'postgressql://postgres:Ctugk3nd3s@localhost:5432/Cooperativedb'
const { Sequelize } = require('sequelize');
const bcrypt = require ('bcrypt')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const memApplicationRoutes = require('./routes/mem_applicationRoute');
const userRoutes = require('./routes/userRoute');
const contentRoutes = require('./routes/contentRoute');
const loan_applicationRoutes = require('./routes/loan_applicationRoute');
const memberpageRoutes = require('./routes/memberpageRoute');
const managerpageRoutes = require('./routes/managerpageRoute');
const User = require('./models/user');
const Application = require('./models/application');


 
const isAuthenticated = (req, res, next) => {
  console.log('Checking authentication status...');
  try {
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('Authenticated:', req.isAuthenticated());
   
    if (req.isAuthenticated() || req.path === '/login') {
      console.log('User is authenticated or trying to log in.');
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
app.use((req, res, next) => {
  console.log('Request body:', req.body);
  next();
});

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
  failureFlash: true
}, async (email, password, done) => {
  try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
          return done(null, false, { message: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
  } catch (error) {
      return done(error);
  }
}));

app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), async (req, res) => {
  try {
      
      const redirectTo = req.session.returnTo || '/'; 
      res.redirect(redirectTo);
  } catch (error) {
      console.error('Error in login route handler:', error);
      res.status(500).send('Internal server error');
  }
});

app.use(memApplicationRoutes); 
app.use(userRoutes);
app.use(contentRoutes);
app.use(loan_applicationRoutes);
app.use(memberpageRoutes);
app.use(managerpageRoutes);

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

app.get('/login', (req, res) => {
  res.render('login', { title: 'Sign In / Up Form'});
});

app.get('/SystemAdmin/systemadmin', (req, res) => {
  res.render('SystemAdmin/systemadmin', { title: 'System Admin'});
});

app.get('/Member/transaction', (req, res) => {
  res.render('Member/transaction', { title: 'Transaction History'});
});

app.get('/Member/sidebar', (req, res) => {
  res.render('Member/sidebar', { title: 'Sidebar'});
});

app.get('/Member/inquire', (req, res) => {
  res.render('Member/inquire', { title: 'Inquire '});
});

app.get('/Member/announcement', (req, res) => {
  res.render('Member/announcement', { title: 'Announcement '});
});

app.get('/Member/applyloan', (req, res) => {
  res.render('Member/applyloan', { title: 'Apply Loan '});
});

app.get('/Member/cbu_deposit', (req, res) => {
  res.render('Member/cbu_deposit', { title: 'CBU-Deposit '});
});

app.get('/Member/curent_loan', (req, res) => {
  res.render('Member/curent_loan', { title: 'Current-Loan '});
});

app.get('/Member/dividend_deposit', (req, res) => {
  res.render('Member/dividend_deposit', { title: 'Dividend-Deposit '});
});

app.get('/Member/profile', (req, res) => {
  res.render('Member/profile', { title: 'Profile '});
});

app.get('/Member/regular_loan', (req, res) => {
  res.render('Member/regular_loan', { title: 'Regular Loan '});
});

app.get('/Member/savings_deposit', (req, res) => {
  res.render('Member/savings_deposit', { title: 'Savings Deposit '});
});

app.get('/Manager/create_announcement', (req, res) => {
  res.render('Manager/create_announcement', { title: 'Create Announcement'});
});

app.get('/Manager/managerannouncement', (req, res) => {
  res.render('Manager/managerannouncement', { title: 'Manager Announcement'});
});

app.get('/Manager/memberinfo', (req, res) => {
  res.render('Manager/memberinfo', { title: 'Member Info'});
});

app.get('/Manager/membersdata', (req, res) => {
  res.render('Manager/membersdata', { title: 'Members Data'});
});

app.get('/Manager/req', (req, res) => {
  res.render('Manager/req', { title: 'Req'});
});

app.get('/Manager/request', (req, res) => {
  res.render('Manager/request', { title: 'Request'});
});

app.get('/Manager/sidebarmanager', (req, res) => {
  res.render('Manager/memberinfo', { title: 'Sidebar Manager'});
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404'})
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
