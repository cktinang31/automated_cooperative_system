const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');


const connectionString = 'postgresql://postgres.wktdygngpenuvshfxnam:@CoopM0B1L3--@aws-0-ap-southeast-1.pooler.supabase.com/postgres';
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: console.log,
});


const User = require('./user');
const Loan_application = require('./loan_application');

const LoanModel = (sequelize) => {
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
            type: DataTypes.FLOAT(10, 2),
            allowNull: false,
        },
        total_amount: {
            type: DataTypes.FLOAT(10, 2),
            allowNull: false,
        },
        balance: {
            type: DataTypes.FLOAT(10, 2),
            allowNull: false,
        },
        loan_term: {
            type: DataTypes.ENUM('6 months', '12 months', '18 months', '24 months'),
            allowNull: false,
        },
        interest: {
            type: DataTypes.FLOAT(10, 2),
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
    
    Loan.associate = (models) => {
        Loan.belongsTo(models.Loan_application, {
            foreignKey: 'application_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        
        Loan.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

    };
 
    return Loan;
    

};


module.exports = LoanModel;
