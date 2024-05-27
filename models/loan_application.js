const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');


const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log
});


const User = require('./user'); 

const Loan_application = sequelize.define('Loan_application', {
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
    application_id: {
        type: DataTypes.UUID, 
        allowNull: false,
        primaryKey: true,
        defaultValue: () => uuidv4() 
    },
    application_status: {
        type: DataTypes.ENUM('pending', 'approved', 'declined'),
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
    number_of_payments: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date_sent: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW 
    }
},
{timestamps: false,});


Loan_application.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


Loan_application.sync();
module.exports = Loan_application;
