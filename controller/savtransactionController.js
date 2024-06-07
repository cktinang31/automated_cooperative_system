const User = require ('../models/user');
const Savings = require ('../models/savings');
const Savtransaction = require ('../models/savtransaction');
const { v4: uuidv4 } = require('uuid');

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
            savtransaction_id: uuidv4(),
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
};


const update_savings_request = async (req, res) => {
    try {
        const { savtransaction_id, status } = req.body;

        if (!savtransaction_id || !status) {
            console.log('Transaction ID and status are required');
            return res.status(400).send('Transaction ID and status are required');
        }

        const savtransaction = await Savtransaction.findByPk(savtransaction_id, {
            include: [{ model: User, as: 'User' }]
        });

        if (!savtransaction) {
            console.log(`Transaction not found for ID: ${savtransaction_id}`);
            return res.status(404).send('Transaction not found');
        }

        console.log('Savtransaction found:', savtransaction);

        savtransaction.status = status;
        await savtransaction.save();

        console.log('Updated Savtransaction status:', savtransaction.status);

        if (status === 'approved') {
            const user_id = savtransaction.user_id;
            const amount = savtransaction.amount;
            const transaction_type = savtransaction.transaction_type; 

            const userSavings = await Savings.findOne({ where: { user_id } });

            if (!userSavings) {
                console.log(`User savings not found for user ID: ${user_id}`);
                return res.status(404).send('User savings not found');
            }

            console.log('User savings found:', userSavings);

            if (transaction_type === 'deposit') {
                userSavings.amount += amount; 
            } else if (transaction_type === 'withdraw') {
                userSavings.amount -= amount; 
            }

            await userSavings.save();

            console.log('Updated user savings:', userSavings);

            return res.redirect('/Manager/savingsrequest');
        } else {
            await savtransaction.destroy();
            console.log('Transaction declined and deleted:', savtransaction_id);
            return res.send('Request declined');
        }
    } catch (error) {
        console.error('Error updating request status:', error);
        return res.status(500).send('Error updating request status');
    }
};




  



module.exports = {
    savings_transaction,
    update_savings_request,
}