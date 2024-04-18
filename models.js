const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
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
    fname: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    lname: {
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
    },
    profilePicture: {
        type: Sequelize.BLOB('long'),
        allowNull: true,
      },
    });
    


const Savings = sequelize.define('Savings', {  
    savings_id: {    
        type: DataTypes.INTEGER,     
        primaryKey: true,     
        autoIncrement: true  
    },   
    user_id: {     
        type: DataTypes.INTEGER,     
        allowNull: true 
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


Savings.belongsTo(User, {
    foreignKey: 'user_id', 
    onDelete: 'CASCADE' 
});

// // 


const CBU = sequelize.define('CBU', {
    cbu_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    user_id: {
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
    loan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
        autoIncrement: true,
        primaryKey: true,
    },
    application_status: {
        type: DataTypes.ENUM('pending', 'approve', 'decline'),
        allowNull: false,
    },
    loan_type: {
        type: DataTypes.ENUM('regular', 'medical', 'emergency'),
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    loan_term: {
        type: DataTypes.ENUM('6 months', '12 months', '18 months', '24 months'),
        allowNull: false,
    },
    interest: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    monthly_payment: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    number_of_payments:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    }
}, 
    
);

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
    transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    savings_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    cbu_transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    cbu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    history_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    },
    application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    cbu_transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    loan_id: {
    type: DataTypes.INTEGER,
    },
    user_id: {
    type: DataTypes.INTEGER,
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

const Chat = sequelize.define('Chat', {
    chat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    },
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

// Content.belongsTo(User, {
//     foreignKey: 'user_id', 
//     onDelete: 'CASCADE' 
// });

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

const Comment = sequelize.define('Comment', {
    comment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    content_id: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    comment: {
    type: DataTypes.TEXT,
    allowNull: false
    },
    timestamp: {
    type: DataTypes.DATE,
    allowNull: false
    }
});

Comment.belongsTo(User, {
    foreignKey: 'user_id', 
    onDelete: 'CASCADE' 
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
Content.sync();
Comment.sync();


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
    Content,
    Comment,
}


