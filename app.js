const express = require('express');
const router = express.Router();
const session = require('express-session');
const crypto = require('crypto');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const knex = require('knex')(require('./knexfile').development);
const { createClient } = require('@supabase/supabase-js'); 
const supabaseUrl = 'https://wktdygngpenuvshfxnam.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdGR5Z25ncGVudXZzaGZ4bmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0NzgwOTIsImV4cCI6MjA0NTA1NDA5Mn0.d7sxmS9PRJpz4k1UUEvpg0CIsXkD8UfnaB8dDndCgao'; // Replace with your key
const supabase = createClient(supabaseUrl, supabaseKey); 
const dotenv = require('dotenv');
dotenv.config();


const connectionString = 'postgresql://postgres.wktdygngpenuvshfxnam:@CoopM0B1L3--@aws-0-ap-southeast-1.pooler.supabase.com/postgres';
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
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
const loan_paymentRoutes = require('./routes/loan_paymentRoute');
const { Application, Cbu, Cbutransaction, Loan_application, Loan_payment, 
  Loan, Savings, Savtransaction, User, VMessage } = require('./models/sync');
const cbuRoutes = require('./routes/cbuRoute');
const savingsRoutes = require('./routes/savingsRoute');
const savtransactionRoutes = require('./routes/savtransactionRoute');
const cbutransactionRoutes = require('./routes/cbutransactionRoute');
const collectorRoutes = require('./routes/collectorRoute');
const vmessageRoutes = require('./routes/vmessageRoute');
const { messages } = require('./controller/vmessageController');




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


const corsOptions = {
  origin: '*', // Allow all origins, or specify a list of allowed origins
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type',
};

app.use(cors(corsOptions));


const secretKey = crypto.randomBytes(64).toString('hex');

app.use(cors());
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
app.use(express.urlencoded({ extended: true }));
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
app.use(vmessageRoutes);


app.get('/tables', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).send('Server error');
  }
});



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

app.get('/login', (req, res) => {
  const { error } = req.query;
  res.render('login',  { title: 'Login', errorMessage: error},);
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


// app.get('/your-route', (req, res) => {
//   const user = {
//       name: 'Kristine Anne Cardosa',
//       email: 'kristineanne@gmail.com'
//   };
//   res.render('your-template', { user: user });
// });

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404'})
});


// Test the connection
knex.raw('SELECT 1')
  .then(() => console.log('Connected to Supabase!'))
  .catch(err => console.error('Connection failed:', err))
  .finally(() => knex.destroy());


  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
  });
