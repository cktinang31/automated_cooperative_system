const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const connectionString = 'postgresql://postgres.wktdygngpenuvshfxnam:@CoopM0B1L3--@aws-0-ap-southeast-1.pooler.supabase.com/postgres';
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: console.log,
});


const User = require('../models/user'); 
const Application = require('../models/application');


const SavingsModel = (sequelize) => {
    const Savings = sequelize.define('Savings', {
        savings_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            unique:true,
        },
        application_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Application,  
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
        amount: {
            type: DataTypes.FLOAT(10, 2),
            allowNull: false
        },
        interest: {
            type: DataTypes.FLOAT(10, 2),
            allowNull: true
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW
        }
    });
    
    
    const associate = (models) => {
        Savings.belongsTo(models.Application, {
            foreignKey: 'application_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        Savings.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    Savings.associate = associate;

    return Savings;
};


module.exports = SavingsModel;
