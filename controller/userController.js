const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require ('../models/user');




const user_reg = async (req, res) => {
  try {
    const { user_id, password } = req.body;
    console.log('Request Body:', req.body);

    const existingUser = await User.findOne({ where: { user_id } });

    if (existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
      existingUser.registered = true;
      await existingUser.save();
      console.log('Account Updated:', existingUser);
      return res.redirect('/login');
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

       
        switch (user.role) {
          case 'admin':
            return res.redirect('/SystemAdmin/systemadmin');
          case 'manager':
            return res.redirect('/Manager/sidebarmanager');
          default:
            return res.redirect('/Member/sidebar');
        }
      });
    })(req, res);

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in.');
  }
};

const update_user = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { role } = req.body;

    if (!user_id || !role) {
      return res.status(400).send('User Id and role are required.');
    }

    const updatedUser = await User.findByPk(user_id);
    if (!updatedUser) {
      return res.status(404).send('User not found.');
    }

    updatedUser.role = role;
    await updatedUser.save();

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).send('Internal server error.');
  }
};

const delete_user = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).send('User ID is required.');
    }

    const deleteUser = await User.findByPk(user_id);
    if (!deleteUser) {
      return res.status(404).send('User not found.');
    }

    if (deleteUser.role === 'admin') {
      return res.status(403).send('Cannot delete admin user.');
    }

    await deleteUser.destroy();
    return res.status(200).send('User deleted.');
  } catch (error) {
    return res.status(500).send('Error deleting user.');
  }
};

const add_user = async (req, res) => {
  try  {
    const {fname, lname, email} = req.body;
    console.log ('Request Body:', req.body);

    const existingUser = await User.findOne({where: {email}});

    if (existingUser) {
        return res.status(400).send('A user with this email is already registered in the system.');
    }
    
  
    const newUser = await User.create({
      fname,
      lname,
      email,
    });

    console.log('New User:', newUser);
    res.send('User added successfully. Proceed to register!');
  } catch (error) {
    console.error('Error registering:', error);
    res.status(500).send('Error registering.');
  }

  };


module.exports = {
   user_reg,
   user_login,
   update_user,
   delete_user,
   add_user,
}
