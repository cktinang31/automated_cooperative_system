const {Application, 
    Cbu, 
    Cbutransaction, 
    Loan_application, 
    Loan_payment, 
    Loan, 
    Savings, 
    Savtransaction,
    User,} = require('../models/sync');

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

        // Validate inputs
        if (!savtransaction_id || !status) {
            return res.status(400).json({ message: 'Transaction ID and status are required' });
        }

        console.log(`Processing request for transaction ID: ${savtransaction_id} with status: ${status}`);

        // Fetch the savings transaction
        const savtransaction = await Savtransaction.findByPk(savtransaction_id, {
            include: [{ model: User, as: 'User' }]
        });

        if (!savtransaction) {
            console.log(`Transaction not found for ID: ${savtransaction_id}`);
            return res.status(404).json({ message: `Transaction not found for ID: ${savtransaction_id}` });
        }

        console.log('Transaction found:', savtransaction);

        // Update the transaction status or delete
        savtransaction.status = status;
        await savtransaction.save();

        if (status === 'approved') {
            const user_id = savtransaction.user_id;
            const amount = savtransaction.amount;
            const transaction_type = savtransaction.transaction_type;

            const userSavings = await Savings.findOne({ where: { user_id } });

            if (!userSavings) {
                console.log(`User savings not found for user ID: ${user_id}`);
                return res.status(404).json({ message: `User savings not found for user ID: ${user_id}` });
            }

            console.log('User savings found:', userSavings);

            // Adjust savings balance based on transaction type
            if (transaction_type === 'deposit') {
                userSavings.amount += amount;
            } else if (transaction_type === 'withdraw') {
                userSavings.amount -= amount;
            }

            await userSavings.save();
            console.log('User savings updated:', userSavings);
            return res.json({ message: 'Savings transaction approved successfully' });
        } else if (status === 'declined') {
            console.log('Declining transaction, deleting it from database');
            await savtransaction.destroy();
            console.log('Transaction deleted:', savtransaction_id);
            return res.json({ message: 'Savings transaction declined and deleted' });
        }

    } catch (error) {
        console.error('Error updating savings request:', error);
        return res.status(500).json({ message: 'Error updating savings request' });
    }
};


  



module.exports = {
    savings_transaction,
    update_savings_request,
}