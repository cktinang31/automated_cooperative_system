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

const savings_transaction = async (req, res, amount, transaction_type, mode) => {
    try {
        const user_id = req.session.passport.user;

        // Ensure user_id is valid
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

        // Handle the withdrawal scenario
        if (transaction_type === 'withdraw' && (userSavings.amount - amount < 500)) {
            console.error('Withdrawal would result in balance less than 500');
            return res.status(400).send('Withdrawal would result in balance less than 500.');
        }

        // Create the savings transaction
        const newSavtransaction = await Savtransaction.create({
            savtransaction_id: uuidv4(),
            user_id,
            savings_id: userSavings.savings_id,
            amount,
            transaction_type,
            mode,
            status: 'pending',
            date_sent: new Date(),
        });

        console.log('Savings Transaction Submitted:', newSavtransaction);
        res.send('Savings transaction request submitted.');
    } catch (error) {
        console.error('Error submitting savings transaction: ', error);
        return res.status(500).send('Error submitting savings transaction');
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
            return res.json({ message: 'Savings transaction approved successfully.' });

        } else if (status === 'declined') {
            console.log('Transaction declined, status updated.');
            return res.json({ message: 'Savings transaction declined.' });
        }

    } catch (error) {
        console.error('Error updating savings request:', error);
        return res.status(500).json({ message: 'Error updating savings request' });
    }
};

const handle_transaction_submission = async (req, res) => {
    try {
        let { amount, transaction_type, 'payment-mode': mode, 'fund-type': fundType } = req.body;

        // Validate and ensure amount is a valid number
        if (Array.isArray(amount)) {
            amount = amount.reduce((total, num) => total + parseFloat(num), 0);
        } else {
            amount = parseFloat(amount);
        }

        if (isNaN(amount)) {
            console.error('Invalid amount value:', amount);
            return res.status(400).send('Invalid amount.');
        }

        // Decide which transaction function to call based on the fund type
        if (fundType === 'savings') {
            // Call the savings transaction handler
            await savings_transaction(req, res, amount, transaction_type, mode);
        } else if (fundType === 'cbu') {
            // Call the CBU transaction handler
            await cbu_transaction(req, res, amount, transaction_type, mode);
        } else {
            console.error('Invalid fund type');
            return res.status(400).send('Invalid fund type.');
        }

    } catch (error) {
        console.error('Error processing transaction:', error);
        return res.status(500).send('Error processing the transaction.');
    }
};





module.exports = {
    savings_transaction,
    update_savings_request,
    handle_transaction_submission
}