const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

// Initialize Sequelize
const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log
});

// Import User and Loan_application models
const User = require('./user');
const Loan_application = require('./loan_application');
const Loan = sequelize.define('Loan', {
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
        primaryKey: true,
        defaultValue: uuidv4
    },
    loan_status: {
        type: DataTypes.ENUM('active', 'approved', 'closed'),
        allowNull: false,
    },
    loan_type: {
        type: DataTypes.ENUM('regular', 'medical', 'emergency'),
        allowNull: false,
    },
    loan_amount: {
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
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true, 
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true, 
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

// Define associations
Loan.belongsTo(Loan_application, {
    foreignKey: 'application_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Loan.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// // Synchronize models
// Loan.sync()
//     .then(() => {
//         console.log('Loan table synchronized successfully!');
//     })
//     .catch((error) => {
//         console.error('Error synchronizing Loan table:', error);
//     });

module.exports = Loan;