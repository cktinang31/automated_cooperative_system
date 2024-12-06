const passport = require('passport');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const nodemailer = require("nodemailer");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');  // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  }
});

const upload = multer({ storage: storage });
const {Application, 
  Cbu, 
  Cbutransaction, 
  Loan_application, 
  Loan_payment, 
  Loan, 
  Savings, 
  Savtransaction,
  User,} = require('../models/sync');

  
  const user_reg = async (req, res) => {
    try {
      const { user_id, password } = req.body;
      console.log('Request Body:', req.body);
  
      const existingUser = await User.findOne({ where: { user_id } });
  
      if (existingUser) {
        if (existingUser.registered) {
          console.log('User is already registered. Proceed to log in.');
          return res.status(400).send('User is already registered. Please log in.');
        } else {
          // Proceed to update the password for unregistered users
          const hashedPassword = await bcrypt.hash(password, 10);
          existingUser.password = hashedPassword;
          existingUser.registered = true;
          await existingUser.save();
          console.log('Account Updated:', existingUser);
          return res.redirect('/login');
        }
      } else {
        console.log('User not found. Cannot update password.');
        return res.status(404).send('User not found. Cannot update password.');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      res.status(500).send('Error updating account.');
    }
  };
  


  const user_login = async (req, res) => {
    try {
      const { user_id, password } = req.body;
      console.log('Login Request Body:', req.body);
  
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          console.error('Error authenticating user:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        if (!user) {
          let errorMessage = '';
          if (info && info.message === 'Incorrect credentials') {
            console.log('Incorrect password for user:', user_id);
            errorMessage = 'Incorrect password.';
          } else {
            console.log('User not registered with user_id:', user_id);
            errorMessage = 'User not found. Please register first.';
          }
  
          // Redirect to login with the error message as a query parameter
          return res.redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
        }
  
        req.login(user, (err) => {
          if (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({ message: 'Error logging in.' });
          }
          console.log('User logged in successfully:', user);
  
          switch (user.role) {
            case 'admin':
              return res.redirect('/SystemAdmin/systemadmin');
            case 'manager':
              return res.redirect('/Manager/dashboard');
            case 'collector':
              return res.redirect('/Collector/dashboardcollector');
            default:
              return res.redirect('/Member/dashboard');
          }
        });
      })(req, res);
  
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).send('Error logging in.');
    }
  };
  

const edit_user = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fname, lname, email, role } = req.body;

    console.log('Received data:', { userId, fname, lname, email, role });

    if (!userId || !fname || !lname || !email || !role) {
      return res.status(400).json({ message: 'User ID, first name, last name, email, and role are required.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

   
    user.fname = fname;
    user.lname = lname;
    user.email = email;
    user.role = role;
    
  
    await user.save();

    console.log('Updated user:', user);

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

 
const delete_user = async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).send('User not found');
      }
      await user.destroy();
      return res.status(200).send('User deleted successfully');
  } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).send('Error deleting user.');
  }
};
 
const add_user = async (req, res) => {
  try  {
    const {fname, lname, email, role} = req.body;
    console.log ('Request Body:', req.body);
 
    const existingUser = await User.findOne({where: {email}});
 
    if (existingUser) {
        return res.status(400).send('A user with this email is already registered in the system.');
    }
   
 
    const newUser = await User.create({
      fname,
      lname,
      email,
      role,
    });
 
    console.log('New User:', newUser);
    res.send('User added successfully. Proceed to register!');
  } catch (error) {
    console.error('Error registering:', error);
    res.status(500).send('Error registering.');
  }
 
  };
  const profile_update = async (req, res) => {
    const user_id = req.user.user_id; // Assuming user_id is stored in session or JWT
    console.log("Received ID:", user_id);
  
    try {
      const { full_name, email, current_password, new_password } = req.body;
      const profilePicture = req.file ? req.file.path : null; // Get file path if file is uploaded
  
      console.log('Request Body:', req.body);
      console.log('Uploaded File:', req.file);
  
      // Fetch the user from the database based on user_id
      const user = await User.findOne({ where: { user_id } });
  
      if (!user) {
        return res.status(404).send('User not found.');
      }
  
      // Check if the current password provided matches the stored password (plain text comparison)
      const isPasswordCorrect = await bcrypt.compare(current_password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).send('Current password is incorrect.');
      }
  
      // Check if the new email already exists in the system (excluding current user's email)
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).send('A user with this email is already registered in the system.');
        }
      }
  
      // Update profile data (email, full_name, profile picture)
      if (full_name) {
        user.full_name = full_name;
      }
  
      if (email) {
        user.email = email;
      }
  
      // Update profile picture if uploaded
      if (profilePicture) {
        console.log("Profile picture path:", profilePicture);  // Log to check the file path
        user.profilePicture = profilePicture;
      }
  
      if (new_password) {
        // Hash the new password if provided
        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedPassword;
      }
  
      // Save the updated user data to the database
      await user.save();
  
      console.log('User profile updated successfully.');
  
      // Send success response
      res.status(200).send('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).send('Internal server error.');
    }
  };


  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });

  let mailOptions = {
    from: 'automatedcooperativesystem@gmail.com',
    to:'automatedcooperativesystem@gmail.com',
    subject: 'Nodemailer Project',
    text: 'Hi from your nodemailer project'
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
  
 
  const verify = async (req, res) => {
    try {
      const { user_id, email } = req.body;
      console.log('Verification Credentials:', req.body);
  
      if (!user_id || !email) {
        let errorMessage = 'Please provide both user_id and email.';
        console.log(errorMessage);
        return res.status(400).json({ error: errorMessage });
      }
  
     
      const user = await User.findOne({
        where: {
          user_id: user_id,
          email: email
        }
      });
  

      if (!user) {
        let errorMessage = 'No user found with the provided user_id and email.';
        console.log(errorMessage);
        return res.status(404).json({ error: errorMessage });
      }
  
    
      const recoveryLink = `https://yourapp.com/reset-password?token=${user.user_id}`; 
      
      const recoveryMailOptions = {
        from: 'automatedcooperativesystem@gmail.com',
        to: email, 
        subject: 'Account Recovery',
        text: `Click here to reset your password: ${recoveryLink}`, 
      };
  
     
      await transporter.sendMail(recoveryMailOptions);
  
    
      return res.status(200).json({
        message: 'Verification successful. A recovery link has been sent to your email.'
      });
  
    } catch (error) {
      console.error('Error during verification:', error);
      return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
  };

  
module.exports = {
   user_reg,
   user_login,
   edit_user,
   delete_user,
   add_user,
   profile_update,
   verify,
}