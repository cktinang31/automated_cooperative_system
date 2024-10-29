const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const connectionString = 'postgresql://postgres.wktdygngpenuvshfxnam:@CoopM0B1L3--@aws-0-ap-southeast-1.pooler.supabase.com/postgres';
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: console.log,
});


const User = require('./user');
const Loan_application = require('./loan_application');
const Loan = require('./loan');

const LoanPaymentModel = (sequelize) => {
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
        number_of_payments: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
    
    Loan_payment.associate = (models) => {
        Loan_payment.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        
        Loan_payment.belongsTo(models.Loan_application, {
            foreignKey: 'application_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        Loan_payment.belongsTo(models.Loan, {
            foreignKey: 'loan_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        
    

    };

    return Loan_payment;
}



module.exports = LoanPaymentModel;