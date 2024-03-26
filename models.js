const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {  
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
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

// // 


const CBU = sequelize.define('CBU', {
    user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    cbu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
    interest: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
    loan_id: {
    type: DataTypes.INTEGER,
    },
    timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    },
});

CBU.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

// (async () => {
//     try {
//         const schema = await sequelize.getQueryInterface().describeTable('CBU');
//         console.log(schema);
//     } catch (error) {
//         console.error("Error getting table schema:", error);
//     } finally {
//         await sequelize.close();
//     }
// })();

const Loan = sequelize.define('Loan', {
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    loan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    loan_status: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    payment: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
    balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
    savings: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
    loan_term: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    },
});


Loan.belongsTo(User, {
    foreignKey: 'user_id', 
    onDelete: 'CASCADE' 
});

// (async () => {
//     try {
//         const schema = await sequelize.getQueryInterface().describeTable('Loan');
//         console.log(schema);
//     } catch (error) {
//         console.error("Error getting table schema:", error);
//     } finally {
//         await sequelize.close();
//     }
// })();

const Loan_application = sequelize.define('Loan_application', {
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    application_status: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    loan_type: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
    loan_term: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    interest: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
    timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    },
});

Loan_application.belongsTo(User, {
    foreignKey: 'user_id', 
    onDelete: 'CASCADE' 
});

// (async () => {
//     try {
//         const schema = await sequelize.getQueryInterface().describeTable('Loan_application');
//         console.log(schema);
//     } catch (error) {
//         console.error("Error getting table schema:", error);
//     } finally {
//         await sequelize.close();
//     }
// })();

const Transaction = sequelize.define('Transaction', {
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    savings_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    transaction_type: {
    type: DataTypes.ENUM('deposit', 'withdraw'),
    allowNull: false,
    },
    amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
    timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    },
});

Transaction.belongsTo(User, {
    foreignKey: 'user_id', 
    onDelete: 'CASCADE' 
});

// (async () => {
//     try {
//         const schema = await sequelize.getQueryInterface().describeTable('Transaction');
//         console.log(schema);
//     } catch (error) {
//         console.error("Error getting table schema:", error);
//     } finally {
//         await sequelize.close();
//     }
// })();

const CBUTransaction = sequelize.define('CBUTransaction', {
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    cbu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    cbu_transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    transaction_type: {
    type: DataTypes.ENUM('deposit', 'withdraw'),
    allowNull: false,
    },
    amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
    timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    },
});

CBUTransaction.belongsTo(User, {
    foreignKey: 'user_id', 
    onDelete: 'CASCADE' 
});

// (async () => {
//     try {
//         const schema = await sequelize.getQueryInterface().describeTable('CBUTransaction');
//         console.log(schema);
//     } catch (error) {
//         console.error("Error getting table schema:", error);
//     } finally {
//         await sequelize.close();
//     }
// })();

const History = sequelize.define('History', {
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    },
    cbu_transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    loan_id: {
    type: DataTypes.INTEGER,
    },
    history_id: {
    type: DataTypes.INTEGER,
    },
    timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
    },
});

// (async () => {
//     try {
//         const schema = await sequelize.getQueryInterface().describeTable('History');
//         console.log(schema);
//     } catch (error) {
//         console.error("Error getting table schema:", error);
//     } finally {
//         await sequelize.close();
//     }
// })();

const Chat = sequelize.define('Chat', {
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    chat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    },
    recipient: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    chat: {
    type: DataTypes.TEXT,
    allowNull: false,
    },
    timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
    },
});

// (async () => {
//     try {
//         const schema = await sequelize.getQueryInterface().describeTable('History');
//         console.log(schema);
//     } catch (error) {
//         console.error("Error getting table schema:", error);
//     } finally {
//         await sequelize.close();
//     }
// })();

                
Application.sync();
User.sync();
Savings.sync();
CBU.sync();
Loan.sync();                              
Loan_application.sync();
Transaction.sync();
CBUTransaction.sync();
History.sync();
Chat.sync();

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
module.exports = {
    Application,
    User,
    Savings,
    CBU,
    Loan,
    Loan_application,
    Transaction,
    CBUTransaction,
    History,
    Chat,
    
}


