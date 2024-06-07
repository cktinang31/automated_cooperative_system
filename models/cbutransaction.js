const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log
});

const User = require('../models/user'); 
const Cbu = require('../models/cbu');

const Cbutransaction = sequelize.define('Cbutransaction', {
    cbutransaction_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
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
        type: DataTypes.FLOAT,
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

Cbutransaction.belongsTo(Cbu, {
    foreignKey: 'cbu_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Cbutransaction.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Cbutransaction.sync()
    .then(() => {
        console.log('CBU Transaction tables synchronized successfully');
    })
    .catch((error) => {
        console.error('Error synchronizing tables:', error);
    });

module.exports = Cbutransaction;
