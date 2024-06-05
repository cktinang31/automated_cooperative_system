const User = require ('../models/user');
const Savings = require ('../models/savings');
const Savtransaction = require ('../models/savtransaction');

const savings_transaction = async (req, res) => {
    try { 
        const { amount, transaction_type, mode } = req.body;

        console.log('Request Body:', req.body);
    
        const user_id = req.session.passport.user;

        if (!user_id) {
            console.error('User ID is null or undefined');
            return res.status(401).send('User ID is null or undefined');
        }

        const userSavings = await Savings.findOne({ where: { user_id } });

        if (!userSavings || !userSavings.savings_id) {
            console.error('Savings ID is null or undefined');
            return res.status(401).send('Savings ID is null or undefined');
        }

        const newSavtransaction = await Savtransaction.create({
            user_id,
            savings_id: userSavings.savings_id, 
            amount,
            transaction_type,
            mode,
            status: 'pending',
            timestamp: new Date(),
        });
        
        console.log('Request Submitted:', newSavtransaction);
        res.send('Request Submitted.');
    } catch (error) {
        console.error('Error submitting request: ', error);
        return res.status(500).send('Error submitting the request');
    }
}



module.exports = {
    savings_transaction,
}