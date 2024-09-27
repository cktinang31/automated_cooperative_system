const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { application } = require('express');

const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log
});

const Application = require('../models/application')(sequelize);
const Loan_application = require('../models/loan_application')(sequelize);
const Savings = require('../models/savings')(sequelize);
const Cbu = require('../models/cbu')(sequelize);
const Savtransaction = require('../models/savtransaction')(sequelize);
const Cbutransaction =require('../models/cbutransaction')(sequelize);
const Loan = require ('../models/loan')(sequelize);
const Loan_payment = require ('../models/loan_payment')(sequelize);


const UserModel = (sequelize) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        application_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Application,  
                key: 'application_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        fname: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        lname: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        place_of_birth: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },

        contact: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profilePicture: {
            type: DataTypes.BLOB('long'),
            allowNull: true,
        },

        registered: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    
        role: {
            type: DataTypes.ENUM('admin', 'regular', 'manager', 'teller', 'collector', 'director'),
            allowNull: true,
        }
    });

    User.associate = (models) => {
        User.belongsTo(models.Application, {
            foreignKey: 'application_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        
        User.hasMany(models.Loan_application, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        User.hasMany(models.Savings, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        User.hasMany(models.Cbu, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        User.hasMany(models.Savtransaction, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        
        User.hasMany(models.Cbutransaction, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        User.hasMany(models.Loan, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        
        User.hasMany(models.Loan_payment, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    User.beforeCreate(async (user) => {
        const count = await User.count();
        user.user_id = 624197 + count;
    });

    return User;
};

const User = UserModel(sequelize);

User.sync()
    .then(async () => {
        const count = await User.count();
        if (count === 0) {
            const hashedPassword = await bcrypt.hash('admin12345', 10);
            try {
                await User.create({
                    user_id: 624197,
                    fname: 'system',
                    lname: 'admin',
                    email: 'admin@gmail.com',
                    password: hashedPassword,
                    registered: true,
                    role: 'admin'
                });
                console.log('Default admin user created successfully.');
            } catch (error) {
                console.error('Error creating default admin user:', error);
            }
        }
    })
    .catch(error => {
        console.error('Error syncing User model:', error);
    });

module.exports = UserModel;