const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log 
});

const User = require('./user');
const Loan = require('../models/loan');
const Loan_payment = require('./loan_payment');


const Collected_payment = sequelize.define('Collected_payment', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    loan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Loan,
            key: 'loan_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    payment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Loan_payment,
            key: 'payment_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    collectedpayment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    number_of_payments: {
         type: DataTypes.INTEGER,
         allowNull: false,
         autoIncrement: true,

    },
    status: {
        type: DataTypes.ENUM('advanced', 'on-time', 'delayed'),
        allowNull: false,
    
    },

    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

Collected_payment.belongsTo(Loan_payment, {
    foreignKey: 'payment_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Collected_payment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Collected_payment.belongsTo(Loan, {
    foreignKey: 'loan_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


Collected_payment.sync()
    .then(() => {
        console.log('Collected_payment table synchronized successfully!');
    })
    .catch((error) => {
        console.error('Error synchronizing Collected_payment table:', error);
    });

module.exports = Collected_payment;