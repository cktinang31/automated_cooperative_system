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
        let { amount, transaction_type, mode } = req.body;

        console.log('Request Body:', req.body);

        // Ensure user_id is valid
        const user_id = req.session.passport.user;
        if (!user_id) {
            console.error('User ID is null or undefined');
            return res.status(401).send('User ID is null or undefined');
        }

        // Find the user's savings record
        const userSavings = await Savings.findOne({ where: { user_id } });
        if (!userSavings || !userSavings.savings_id) {
            console.error('Savings ID is null or undefined');
            return res.status(401).send('Savings ID is null or undefined');
        }

        // Handle the case where amount is an array
        if (Array.isArray(amount)) {
            // Sum up the array of amounts, ensuring they're parsed as floats
            amount = amount.reduce((total, num) => total + parseFloat(num), 0);
        } else {
            // Ensure the amount is a valid number
            amount = parseFloat(amount);
        }

        // Check if the amount is a valid number
        if (isNaN(amount)) {
            console.error('Invalid amount value:', amount);
            return res.status(400).send('Invalid amount.');
        }

        if (transaction_type === 'withdraw') {
            // Check the current balance
            const currentBalance = Savings.amount || 0;

            
            if (currentBalance - amount < 500) {
                console.error('Withdrawal would result in balance less than 500');
                return res.status(400).send('Withdrawal would result in a balance of less than 500.');
            }
        }


        // Create the new savings transaction
        const newSavtransaction = await Savtransaction.create({
            savtransaction_id: uuidv4(),
            user_id,
            savings_id: userSavings.savings_id, 
            amount,
            transaction_type,
            mode,
            status: 'pending',
            date_sent: new Date(),  // Using date_sent as per your table definition
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
            return res.status(400).json({ message: 'Transaction ID and status are required' });
        }

        const allowedStatuses = ['pending', 'approved', 'declined'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status value: ${status}` });
        }

        console.log(`Processing request for transaction ID: ${savtransaction_id} with status: ${status}`);
        const savtransaction = await Savtransaction.findByPk(savtransaction_id, {
            include: [{ model: User, as: 'User' }]
        });

        if (!savtransaction) {
            console.log(`Transaction not found for ID: ${savtransaction_id}`);
            return res.status(404).json({ message: `Transaction not found for ID: ${savtransaction_id}` });
        }

        console.log('Transaction found:', savtransaction);

        savtransaction.status = status;
        await savtransaction.save();
        console.log(`Transaction status updated to: ${status}`);

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

            if (transaction_type === 'deposit') {
                userSavings.amount += amount;
            } else if (transaction_type === 'withdraw') {
                userSavings.amount -= amount;
            }

            await userSavings.save();
            console.log('User savings updated:', userSavings);
            return res.json({ message: 'Savings transaction approved successfully' });

        } else if (status === 'declined') {
            console.log('Transaction declined, status updated.');
            return res.json({ message: 'Savings transaction declined' });
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