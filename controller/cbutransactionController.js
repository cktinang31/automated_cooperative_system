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

const cbu_transaction = async (req, res) => {
    try { 
        let { amount, transaction_type, 'payment-mode': mode } = req.body;


        console.log('Request Body:', req.body);

        const user_id = req.session.passport.user;

        if (!user_id) {
            console.error('User ID is null or undefined');
            return res.status(401).send('User ID is null or undefined');
        }

        // Handle if 'amount' is an array and sum it
        if (Array.isArray(amount)) {
            amount = amount.reduce((total, num) => total + parseFloat(num), 0);
        } else {
            amount = parseFloat(amount);  // Ensure the amount is a number if it's a single value
        }

        // Check if amount is a valid number
        if (isNaN(amount)) {
            console.error('Invalid amount value:', amount);
            return res.status(400).send('Invalid amount.');
        }

        // Retrieve the CBU of the user
        const userCbu = await Cbu.findOne({ where: { user_id } });

        if (!userCbu || !userCbu.cbu_id) {
            console.error('CBU ID is null or undefined');
            return res.status(401).send('CBU ID is null or undefined');
        }

        // Create the new CBU transaction
        const newCbutransaction = await Cbutransaction.create({
            cbutransaction_id: uuidv4(),
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
};


const update_cbu_request = async (req, res) => {
    try {
        const { cbutransaction_id, status } = req.body;

        if (!cbutransaction_id || !status) {
            console.log('Transaction ID and status are required');
            return res.status(400).send('Transaction ID and status are required');
        }

        const cbutransaction = await Cbutransaction.findByPk(cbutransaction_id, {
            include: [{ model: User, as: 'User' }]
        });

        if (!cbutransaction) {
            console.log(`Transaction not found for ID: ${cbutransaction_id}`);
            return res.status(404).send('Transaction not found');
        }

        console.log('Cbutransaction found:', cbutransaction);

        cbutransaction.status = status;
        await cbutransaction.save();

        console.log('Updated Cbutransaction status:', cbutransaction.status);

        if (status === 'approved') {
            const user_id = cbutransaction.user_id;
            const amount = cbutransaction.amount;
            const transaction_type = cbutransaction.transaction_type; 

            const userCbu = await Cbu.findOne({ where: { user_id } });

            if (!userCbu) {
                console.log(`User cbuings not found for user ID: ${user_id}`);
                return res.status(404).send('User cbu not found');
            }

            console.log('User cbu found:', userCbu);

            if (transaction_type === 'deposit') {
                userCbu.amount += amount; 
            } else if (transaction_type === 'withdraw') {
                userCbu.amount -= amount; 
            }

            await userCbu.save();

            console.log('Updated user cbu:', userCbu);

            return res.redirect('/Manager/cburequest');
        } else {
            await cbutransaction.destroy();
            console.log('Transaction declined and deleted:', cbutransaction_id);
            return res.send('Request declined');
        }
    } catch (error) {
        console.error('Error updating request status:', error);
        return res.status(500).send('Error updating request status');
    }
};



module.exports = {
    cbu_transaction,
    update_cbu_request,
}