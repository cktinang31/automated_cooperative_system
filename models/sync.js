const { Sequelize } = require('sequelize');
const connectionString = 'postgresql://postgres.wktdygngpenuvshfxnam:@CoopM0B1L3--@aws-0-ap-southeast-1.pooler.supabase.com/postgres';
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: console.log,
});

const { v4: uuidv4 } = require('uuid'); 



const UserModel = require('../models/user');
const SavingsModel = require('../models/savings');
const ApplicationModel = require('../models/application');
const CbuModel = require('../models/cbu');
const LoanApplicationModel = require('../models/loan_application');
const LoanModel = require('../models/loan');
const LoanPaymentModel = require('../models/loan_payment');
const SavModel = require('../models/savtransaction');
const CModel = require('../models/cbutransaction');
const VMessageModel = require('../models/vmessage');
const ConvoModel = require('../models/convo');
const MessageModel = require('../models/message');




const User = UserModel(sequelize);
const Application = ApplicationModel(sequelize);
const Savings = SavingsModel(sequelize);
const Cbu = CbuModel(sequelize);
const Loan_application = LoanApplicationModel(sequelize);
const Loan = LoanModel(sequelize);
const Loan_payment = LoanPaymentModel(sequelize);
const Savtransaction = SavModel(sequelize);
const Cbutransaction = CModel(sequelize);
const VMessage = VMessageModel(sequelize);
const Convo = ConvoModel(sequelize);
const Message = MessageModel(sequelize);

Application.associate({User});
User.associate({ Application, 
    Loan_application, 
    Savings, 
    Cbu, 
    Savtransaction, 
    Cbutransaction, 
    Loan, 
    Loan_payment, 
    Message });
Loan_application.associate({ User });
Cbu.associate({User, Application,});
Savings.associate({User, Application});
Loan.associate({User, Loan_application});
Loan_payment.associate({User, Loan, Loan_application});
Savtransaction.associate({User, Savings});
Cbutransaction.associate({User, Cbu});
Convo.associate({Message});
Message.associate({Convo, User})



sequelize.sync({ force: false })  
  .then(() => {
    console.log('Database sync successful');
  })
  .catch((error) => {
    console.error('Error syncing the database:', error);
  });

  sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });


module.exports = { sequelize, 
    Application,
    User, 
    Loan_application, 
    Cbu, 
    Savings, 
    Loan, 
    Loan_payment,
    Savtransaction,
    Cbutransaction,
    VMessage,
    Convo,


};
