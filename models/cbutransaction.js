const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const connectionString = 'postgresql://postgres.wktdygngpenuvshfxnam:@CoopM0B1L3--@aws-0-ap-southeast-1.pooler.supabase.com/postgres';
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: console.log,
});


const User = require('../models/user'); 
const Cbu = require('../models/cbu');

const CModel = (sequelize) => {
    const Cbutransaction = sequelize.define('Cbutransaction', {
        cbutransaction_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        cbu_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Cbu,  
                key: 'cbu_id'
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
        transaction_type: {
            type: DataTypes.ENUM ('deposit', 'withdraw'),
            allowNull: false
        },
        mode:  {
            type: DataTypes.ENUM ('cash', 'credit card', 'debit card', 'gcash', 'maya', 'paypal'),
            allownull: false,
        },
        status: {
            type: DataTypes.ENUM ('pending', 'approved', 'decline'),
            allowNull: true
        },
        date_sent: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW 
        }
    },
    {timestamps: false,});


    Cbutransaction.associate = (models) => {
        Cbutransaction.belongsTo(models.Cbu, {
            foreignKey: 'cbu_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        
        Cbutransaction.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return Cbutransaction;
    
    
};


module.exports = CModel;
