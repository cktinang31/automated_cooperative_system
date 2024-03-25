const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {  
    host: 'localhost',
    dialect: 'postgres',
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
    }
},{timestamps: false,});


const  User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});


const Savings = sequelize.define('Savings', {  
    savings_id: {    
        type: DataTypes.INTEGER,     
        primaryKey: true,     
        autoIncrement: true  
    },   
    user_id: {     
        type: DataTypes.INTEGER,     
        allowNull: false 
    },   
    amount: {     
        type: DataTypes.FLOAT,     
        allowNull: false 
    },   
    interest: {     
        type: DataTypes.FLOAT,     
        allowNull: false  
    },  
    loan_id: {     
        type: DataTypes.INTEGER  
    },   
    timestamp: {     
        type: DataTypes.DATE,     
        defaultValue: Sequelize.NOW  
    } 
});


Savings.belongsTo(User, {
    foreignKey: 'user_id', 
    onDelete: 'CASCADE' 
});

(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("Tables synced successfully");
    } catch (error) {
        console.error("Error syncing tables:", error);
    } finally {
        sequelize.close();
    }
})();

const CBU = sequelize.define('CBU', {  
    user_id: {    
        type: DataTypes.INTEGER,     
        primaryKey: true,     
        autoIncrement: true  
    },   
    cbu_id: {     
        type: DataTypes.INTEGER,     
        allowNull: false 
    },   
    amount: {     
        type: DataTypes.FLOAT,     
        allowNull: false 
    },   
    interest: {     
        type: DataTypes.FLOAT,     
        allowNull: false  
    },  
    loan_id: {     
        type: DataTypes.INTEGER  
    },   
    timestamp: {     
        type: DataTypes.DATE,     
        defaultValue: Sequelize.NOW  
    } 
});

CBU.belongsTo(User, {
    foreignKey: 'user_id', 
    onDelete: 'CASCADE' 
});


(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("Tables synced successfully");
    } catch (error) {
        console.error("Error syncing tables:", error);
    } finally {
        sequelize.close();
    }
})();


                
// Application.sync();
// User.sync();
//Savings.sync();

// Application.sync()
//   .then(() => {
//     console.log('Application model synced successfully');
//   })
//   .catch(error => {
//     console.error('Error syncing Application model:', error);
//   });

// User.sync()
//   .then(() => {
//     console.log('User model synced successfully');
//   })
//   .catch(error => {
//     console.error('Error syncing User model:', error);
//   });

// Savings.sync()
//   .then(() => {
//     console.log('Savings model synced successfully');
//   })
//   .catch(error => {
//     console.error('Error syncing Savings model:', error);
//   });

// CBU.sync()
//   .then(() => {
//     console.log('CBU model synced successfully');
//   })
//   .catch(error => {
//     console.error('Error syncing CBU model:', error);
//   });


module.exports = {
    Application,
    User,
    Savings,
    CBU,
}


