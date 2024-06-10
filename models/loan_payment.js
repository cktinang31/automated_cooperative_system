const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log // Enable logging for detailed output
});

// Import models
const User = require('./user');
const Loan_application = require('./loan_application');
const Loan = require('./loan');

// Define Loan_payment model
const Loan_payment = sequelize.define('Loan_payment', {
    application_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Loan_application,
            key: 'application_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
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
        primaryKey: true,

    },
    amount: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
    },
    schedule: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved',  'decline'),
        allowNull: true,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

// Define associations
Loan_payment.belongsTo(Loan_application, {
    foreignKey: 'application_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Loan_payment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Loan_payment.belongsTo(Loan, {
    foreignKey: 'loan_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});



sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
    

// Sync model
Loan_payment.sync()
    .then(() => {
        console.log('Loan_payment table synchronized successfully!');
    })
    .catch((error) => {
        console.error('Error synchronizing Loan_payment table:', error);
    });

module.exports = Loan_payment;