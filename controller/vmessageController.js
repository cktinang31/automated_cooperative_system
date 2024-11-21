const {Application, 
    Cbu, 
    Cbutransaction, 
    Loan_application, 
    Loan_payment, 
    Loan, 
    Savings, 
    Savtransaction,
    User, VMessage} = require('../models/sync');
const { v4: uuidv4 } = require('uuid');



    const messages = async (req, res) => {
        const { fname, lname, email, contact,  message} = req.body;
        const messageDate = new Date();
        try {
        
            const newMessage = await VMessage.create({
                vmessage_id:  uuidv4(),
                fname,
                lname,
                email,
                contact,
                message,
                date_sent: messageDate,
            });
    
            console.log('New Message:', newMessage);
            res.send('Message submitted successfully. Please wait for the reply.');
        } catch (error) {
    
            console.error('Error submitting the application:', error);
            res.status(500).send('Error submitting the application');
        }
    };
    

    module.exports= {messages};