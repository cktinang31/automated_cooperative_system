const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt'); // Note: bcrypt is not used in this model
const connectionString = 'postgresql://postgres.wktdygngpenuvshfxnam:@CoopM0B1L3--@aws-0-ap-southeast-1.pooler.supabase.com/postgres';

const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: console.log,
});

// Define the VMessage model
const VMessageModel = () => {
    const VMessage = sequelize.define('VMessage', {
        vmessage_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Use UUIDV4 to auto-generate UUIDs
            primaryKey: true,
        },
        fname: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        lname: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true, // Validate email format
            },
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_sent: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    }, {
        timestamps: false,
    });

    return VMessage; // Return the model
};


const VMessage = VMessageModel();


sequelize.sync({ force: false }) 
    .then(() => {
        console.log('Database synced! VMessage model is ready.');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

module.exports = VMessageModel;