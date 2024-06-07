const User = require ('../models/user');
const Cbu = require ('../models/cbu');
const Cbutransaction = require ('../models/cbutransaction');

const cbu_transaction = async (req, res) => {
    try { 
        const { amount, transaction_type, mode } = req.body;

        console.log('Request Body:', req.body);
    
        const user_id = req.session.passport.user;

        if (!user_id) {
            console.error('User ID is null or undefined');
            return res.status(401).send('User ID is null or undefined');
        }

        const userCbu = await Cbu.findOne({ where: { user_id } });

        if (!userCbu || !userCbu.cbu_id) {
            console.error('CBU ID is null or undefined');
            return res.status(401).send('CBU ID is null or undefined');
        }

        const newCbutransaction = await Cbutransaction.create({
            user_id,
            cbu_id: userCbu.cbu_id, 
            amount,
            transaction_type,
            mode,
            status: 'pending',
            timestamp: new Date(),
            
        });
        
        console.log('Request Submitted:', newCbutransaction);
        res.send('Request Submitted.');
    } catch (error) {
        console.error('Error submitting request: ', error);
        return res.status(500).send('Error submitting the request');
    }
}



module.exports = {
    cbu_transaction,
}