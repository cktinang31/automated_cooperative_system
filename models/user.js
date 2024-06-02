const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log
});

const User = sequelize.define('User', {
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
        type: DataTypes.BLOB('long'),
        allowNull: true,
    },
   
    role: {
        type: DataTypes.ENUM('admin', 'regular', 'manager', 'teller', 'collector', 'director'),
        allowNull: true,
    }
});

User.beforeCreate(async (user) => {
    const count = await User.count();
    user.user_id = 624197 + count;
    if (count === 0) {
        user.role = 'admin';
    }
});



User.sync();

module.exports = User;
