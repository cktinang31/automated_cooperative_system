const {Application, 
    Cbu, 
    Cbutransaction, 
    Loan_application, 
    Loan_payment, 
    Loan, 
    Savings, 
    Savtransaction,
    User,
    Convo,
    Message} = require('../models/sync');
const { v4: uuidv4 } = require('uuid');


const send_message = async (req, res) => {
    try {
        const { receiver_id, content } = req.body;
        console.log('Request Body:', req.body);
    
        const user_id = req.session.passport.user;
        if (!user_id) {
            console.error('User ID is null or undefined');
            return res.status(401).send('User ID is null or undefined');
        }
    
        console.log('Creating a message');
        const message = await Message.create({
            date_sent: new Date(),  
            receiver_id,
            sender_id: user_id,
            content,
        });
    
        res.status(201).json({
            message: 'Message posted successfully!',
            data: { conversation: message },
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while posting the message.' });
    }
};
    
module.exports = {
    send_message,
  };