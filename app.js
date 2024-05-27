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
const loanRoutes = require('./routes/loanRoute');
const memberpageRoutes = require('./routes/memberpageRoute');
const managerpageRoutes = require('./routes/managerpageRoute');
const systemadminRoutes = require('./routes/systemadminRoute');
const loan_paymentRoutes = require ('./routes/loan_paymentRoute');
const User = require('./models/user');
const Loan_payment = require('./models/loan_payment');
// const Application = require('./models/application');


 
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

const logout = (req, res) => {
  console.log('Logging out...');

  console.log('Session ID:', req.sessionID);
  console.log('Session before destroying:', req.session);

  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).send('Internal server error');
    }

    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send('Internal server error');
      }

      console.log('Session destroyed successfully.');
      res.redirect('/login');
    });
  });
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

app.post('/logout', logout);

app.use(memApplicationRoutes); 
app.use(userRoutes);
app.use(contentRoutes);
app.use(loan_applicationRoutes);
app.use(loanRoutes);
app.use(memberpageRoutes);
app.use(managerpageRoutes);
app.use(systemadminRoutes);
app.use(loan_paymentRoutes);

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

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404'})
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
