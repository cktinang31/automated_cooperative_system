const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: console.log 
});

const Savings = sequelize.define('Savings', {  
    savings_id: {    
        type: DataTypes.INTEGER,    
        primaryKey: true,    
        autoIncrement: true
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
        type: DataTypes.INTEGER  
    },  
    timestamp: {    
        type: DataTypes.DATE,    
        defaultValue: Sequelize.NOW  
    }
});

Savings.addHook('beforeValidate', (savings, options) => {
    if (typeof savings.amount === 'undefined' || savings.amount === null) {
        savings.amount = 500;
    }
});

Savings.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
Savings.sync()
    .then(() => {
        console.log('Savings table synchronized successfully');
    })
    .catch((error) => {
        console.error('Error synchronizing Savings table:', error);
    });

module.exports = Savings;