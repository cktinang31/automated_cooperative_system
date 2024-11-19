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
    const cbutransaction_id = req.params.id;  // Use URL parameter for transaction ID
    const { status } = req.body;

    // Check if required fields are present
    if (!cbutransaction_id || !status) {
        console.log('Transaction ID and status are required');
        return res.status(400).send('Transaction ID and status are required');
    }

    try {
        // Find the CBU transaction by ID
        const cbutransaction = await Cbutransaction.findByPk(cbutransaction_id, {
            include: [{ model: User, as: 'User' }],
        });

        // If transaction not found, return 404
        if (!cbutransaction) {
            console.log(`Transaction not found for ID: ${cbutransaction_id}`);
            return res.status(404).send('Transaction not found');
        }

        console.log('Cbutransaction found:', cbutransaction);

        // Update the transaction status
        cbutransaction.status = status;
        await cbutransaction.save();
        console.log('Updated Cbutransaction status:', cbutransaction.status);

        // Handle approval
        if (status === 'approved') {
            const user_id = cbutransaction.user_id;
            const amount = cbutransaction.amount;
            const transaction_type = cbutransaction.transaction_type;

            const userCbu = await Cbu.findOne({ where: { user_id } });

            if (!userCbu) {
                console.log(`User CBU account not found for user ID: ${user_id}`);
                return res.status(404).send('User CBU account not found');
            }

            console.log('User CBU found:', userCbu);

            // Modify the CBU balance based on transaction type
            if (transaction_type === 'deposit') {
                userCbu.amount += amount;
            } else if (transaction_type === 'withdraw') {
                userCbu.amount -= amount;
                // Ensure no negative balance (optional)
                if (userCbu.amount < 0) {
                    console.log('Cannot withdraw, insufficient balance');
                    return res.status(400).send('Insufficient balance');
                }
            }

            await userCbu.save();
            console.log('Updated user CBU:', userCbu);

            return res.send('CBU Request approved and balance updated');
        } 
        
        else if (status === 'declined') {
            console.log('Attempting to delete CBU transaction...');
            try {
                console.log('CBU Transaction to delete:', cbutransaction);
                await cbutransaction.destroy();
                console.log(`Transaction ${cbutransaction_id} declined and deleted`);
                return res.send('CBU Request declined and transaction deleted');
            } catch (destroyError) {
                console.error('Error destroying transaction:', destroyError);
                return res.status(500).send('Error deleting declined transaction');
            }
        
        } else {
            return res.status(400).send('Invalid status');
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