const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log 
});
const User = require('../models/user');

const Loan_application = sequelize.define('Loan_application', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    application_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    application_status: {
        type: DataTypes.ENUM('pending', 'approve', 'decline'),
        allowNull: false,
    },
    loan_type: {
        type: DataTypes.ENUM('regular', 'medical', 'emergency'),
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    loan_term: {
        type: DataTypes.ENUM('6 months', '12 months', '18 months', '24 months'),
        allowNull: false,
    },
    interest: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    monthly_payment: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    number_of_payments:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    }
},
   
);
 
Loan_application.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Loan_application.sync()
    .then(() => {
        console.log('Loan_application table synchronized successfully');
    })
    .catch((error) => {
        console.error('Error synchronizing Loan_application table:', error);
    });

module.exports = Loan_application;