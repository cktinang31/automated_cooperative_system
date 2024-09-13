const express = require('express');
const router = express.Router();
const session = require('express-session');
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
const cbuRoutes = require('./routes/cbuRoute');
const savingsRoutes = require('./routes/savingsRoute');
const savtransactionRoutes = require('./routes/savtransactionRoute');
const cbutransactionRoutes = require('./routes/cbutransactionRoute');
const collectorRoutes = require('./routes/collectorRoute');


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
  usernameField: 'user_id',
  passwordField: 'password',
  failureFlash: true
}, async (user_id, password, done) => {
  try {
      const user = await User.findOne({ where: { user_id } });

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
  }
));


app.post('/logout', logout);

app.use(memApplicationRoutes); 
app.use(userRoutes);
app.use(contentRoutes);
app.use(loan_applicationRoutes);
app.use(loanRoutes);
app.use(memberpageRoutes);
app.use(managerpageRoutes);
app.use(systemadminRoutes);
app.use(cbuRoutes);
app.use(savingsRoutes);
app.use(savtransactionRoutes);
app.use(cbutransactionRoutes);
app.use(collectorRoutes);
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

// taladro backend testing (ayaw hilabti)

app.get('/savings', (req, res) => {
  res.render('savings', { title: 'savings'});
});

app.post('/savings', async (req, res) => {
  try {
    const { user_id, amount, interest, loan_id } = req.body;
    const newSavingsData = {
      user_id,
      amount: amount || 500, 
      interest,
      loan_id,
      timestamp: new Date()
    };

    const newSavings = await Savings.create(newSavingsData);

    console.log('New Savings:', newSavings);
    res.send('Savings created successfully.');
  } catch (error) {
    console.error('Error creating savings:', error);
    res.status(500).send('Error creating savings.');
  }
});

app.post('/savings', async (req, res) => {
  try {
    const { user_id, amount, interest, loan_id } = req.body;
    const newSavingsData = {
      user_id,
      amount: amount || 500, 
      interest,
      loan_id,
      timestamp: new Date()
    };

    const newSavings = await Savings.create(newSavingsData);

    console.log('New Savings:', newSavings);
    res.send('Savings created successfully.');
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

app.get('/inquire', (req, res) => {
  res.render('inquire', { title: 'Inquire'});
});

app.get('/transaction', (req, res) => {
  res.render('transaction', { title: 'Transaction History'});
});

// app.get('/sidebar', (req, res) => {
//   res.render('sidebar', { title: 'sidebar'});
// });

app.get('/login', (req, res) => {
  res.render('login', { title: 'Sign In / Up Form'});
});

app.get('/Member/transaction', (req, res) => {
  res.render('Member/transaction', { title: 'Transaction History'});
});

app.get('/Member/inquire', (req, res) => {
  res.render('Member/inquire', { title: 'Inquire '});
});

app.get('/Member/announcement', (req, res) => {
  res.render('Member/announcement', { title: 'Announcement '});
});

app.get('/x', (req, res) => {
  res.render('x', { title: 'X'});
});

app.get('/Member/dividend_deposit', (req, res) => {
  res.render('Member/dividend_deposit', { title: 'Dividend-Deposit '});
});

app.get('/Member/profile', (req, res) => {
  res.render('Member/profile', { title: 'Profile '});
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

app.get('/Manager/sidebarmanager', (req, res) => {
  res.render('Manager/memberinfo', { title: 'Sidebar Manager'});
});

//collector nako //

app.get('/Collector/collector', (req, res) => {
  res.render('Collector/collector', { title: 'collector'});
}); 

app.get('/Collector/paymentnotif', (req, res) => {
  res.render('Collector/paymentnotif', { title: 'Payment Notification'});
});

app.get('/your-route', (req, res) => {
  const user = {
      name: 'Kristine Anne Cardosa',
      email: 'kristineanne@gmail.com'
  };
  res.render('your-template', { user: user });
});


// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404'})
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});