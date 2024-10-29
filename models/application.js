const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const connectionString = 'postgresql://postgres.wktdygngpenuvshfxnam:@CoopM0B1L3--@aws-0-ap-southeast-1.pooler.supabase.com/postgres';
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: console.log,
});

const ApplicationModel = (sequelize) => {
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

    Application.associate = (models) => {
        Application.hasOne(models.User, {
            foreignKey: 'application_id', 
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };


    
    Application.beforeCreate(async (application) => {
        const count = await Application.count();
        application.application_id = 499710 + count;
    });
    
    return  Application;

};





module.exports = ApplicationModel;