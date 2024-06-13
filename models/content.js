const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log 
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