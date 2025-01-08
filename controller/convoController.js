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
        const { convo_id, receiver_id, content } = req.body;
        console.log('Request Body:', req.body);  

        const user_id = req.session.passport.user;
     
        if (!user_id) {
          console.error('User ID is null or undefined');
          return res.status(401).send('User ID is null or undefined');
        }
        let convo;

        
        if (convo_id) {
            convo = await Convo.findByPk(convo_id);

            if (!convo) {
                return res.status(404).json({ error: 'Conversation not found.' });
            }
        } else {
           
            convo = await Convo.create({});
        }

       
        const message = await Message.create({
            convo_id: convo.convo_id,
            receiver_id,
            sender_id: user_id,
            content,
        });

        convo.date_sent = new Date();
        await convo.save();

        res.status(201).json({
            message: 'Message posted successfully!',
            data: { conversation: convo, message },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while posting the message.' });
    }
};

module.exports = {
    send_message,
  };