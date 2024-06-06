const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log
});

const User = require('../models/user'); 
const Application = require('../models/application');

const Cbu = sequelize.define('Cbu', {
    cbu_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
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
        type: DataTypes.FLOAT,
        allowNull: false
    },
    interest: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    loan_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
});


Cbu.belongsTo(Application, {
    foreignKey: 'application_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Cbu.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


Cbu.sync()
    .then(() => {
        console.log('Cbu tables synchronized successfully');
    })
    .catch((error) => {
        console.error('Error synchronizing tables:', error);
    });

module.exports = Cbu;
