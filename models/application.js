const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log 
});

const Application = sequelize.define('Application', {
    application_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    fname: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    mname: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    lname: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    place_of_birth: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    application_status: {
        type: DataTypes.ENUM ('pending', 'approved', 'decline'),
        allowNull: false,
        
    },

    date_sent: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW 
    }
},
{timestamps: false,});

Application.beforeCreate(async (application) => {
    const count = await Application.count();
    application.application_id = 499710 + count;
});


Application.sync()


module.exports = Application