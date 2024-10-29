const { Sequelize, DataTypes } = require('sequelize');
const connectionString = 'postgresql://postgres.wktdygngpenuvshfxnam:@CoopM0B1L3--@aws-0-ap-southeast-1.pooler.supabase.com/postgres';
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: console.log,
});


const Content = sequelize.define('Content', {
    content_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    content_title: {
        type: DataTypes.TEXT,
        allowNull:false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

Content.sync()
    // .then(() => {
    //     console.log('Content table synchronized successfully');
    // })
    // .catch((error) => {
    //     console.error('Error synchronizing Content table:', error);
    // });
module.exports = Content;