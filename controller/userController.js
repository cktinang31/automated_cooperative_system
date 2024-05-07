const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require ('../models/user.js');




const user_reg = async (req, res) => {
  try  {
    const {fname, lname, email, password} = req.body;
    console.log ('Request Body:', req.body);

    const existingUser = await User.findOne({where: {email}});

    if (existingUser) {
        return res.status(400).send('A user with this email is already registered in the system.');
    }
    const hashedPassword = await bcrypt.hash(password, 10); 
   
  
    const newUser = await User.create({
      fname,
      lname,
      email,
      password: hashedPassword, 
    });

    console.log('New User:', newUser);
    res.send('Registered successfully. You can now log in Ka-Coop!');
  } catch (error) {
    console.error('Error registering:', error);
    res.status(500).send('Error registering.');
  }

  };

  const user_login = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Login Request Body:', req.body);
  
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          console.error('Error authenticating user:', err);
          return res.status(500).send('Internal server error');
        }
        if (!user) {
          console.log('User not found');
          return res.status(404).send('User not found. Please register first.');
        }
        req.login(user, (err) => {
          if (err) {
            console.error('Error logging in:', err);
            return res.status(500).send('Error logging in.');
          }
          console.log('User logged in successfully:', user);
  
          // Redirect based on user role
          switch (user.role) {
            case 'admin':
              return res.redirect('/SystemAdmin/systemadmin');
            case 'manager':
              return res.redirect('/Manager/managerannouncement');
            default:
              return res.redirect('./Member/announcement');
          }
        });
      })(req, res);
  
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).send('Error logging in.');
    }
  };

  module.exports = {
   user_reg,
   user_login,
};
