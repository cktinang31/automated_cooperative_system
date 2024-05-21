const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log 
});
const Application = require ('../models/application');

const  User = sequelize.define('User', {
    application: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    fname: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    lname: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profilePicture: {
        type: Sequelize.BLOB('long'),
        allowNull: true,
    },

    registered: {
        type: Boolean,
        allowNull: false,
    },
 
    role: {
        type: DataTypes.ENUM('admin', 'regular', 'manager', 'teller', 'collector', 'director'),
        allownull: true,
    }
    });


User.belongsTo(Application, {
    foreignKey: 'application_id',
    onDelete: 'CASCADE'
});
   
User.beforeCreate(async (user) => {
    const count = await User.count();
        user.user_id = 624197 + count;
        if (user.user_id === 624197) {
            user.role = 'admin';
        }
   
});
User.sync()
// .then(() => {
//     console.log('User table synchronized successfully');
// })
// .catch((error) => {
//     console.error('Error synchronizing User table:', error);
// });
    


module.exports = User;