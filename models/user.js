const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { application } = require('express');

const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log
});

const Application = require('../models/application');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    application_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Application,  
            key: 'application_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    fname: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    lname: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    place_of_birth: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },

    contact: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profilePicture: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
    },

    registered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
   
    role: {
        type: DataTypes.ENUM('admin', 'regular', 'manager', 'teller', 'collector', 'director'),
        allowNull: true,
    }
});

User.belongsTo(Application, {
    foreignKey: 'application_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

User.beforeCreate(async (user) => {
    const count = await User.count();
    user.user_id = 624197 + count;
});

User.sync()
  .then(async () => {
    const count = await User.count();
    if (count === 0) {
      const hashedPassword = await bcrypt.hash('admin12345', 10);
      try {
        await User.create({
          user_id: 624197,
          fname: 'system',
          lname: 'admin',
          email: 'admin@gmail.com',
          password: hashedPassword,
          registered: true,
          role: 'admin'
        });
        console.log('Default admin user created successfully.');
      } catch (error) {
        console.error('Error creating default admin user:', error);
      }
    }
  })
  .catch(error => {
    console.error('Error syncing User model:', error);
  });

module.exports = User;
