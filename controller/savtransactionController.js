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
};


const update_savings_request = async (req, res) => {
    try {
        const { savtransaction_id, status } = req.body;
  
        if (!savtransaction_id || !status) {
            return res.status(400).send('Application ID and status are required');
        }
  
        const updatedSavtransaction = await Savtransaction.findByPk(savtransaction_id);
  
        if (!updatedSavtransaction) {
            return res.status(404).send('Request not found');
        }
  
        const user_id = updatedSavtransaction.user_id;
  
        updatedSavtransaction.status = status;
        await updatedSavtransaction.save();
  
        if (application_status === 'approved') {
            const amount = Savings.amount - Savtransaction.amount;
            
  
            const approvedRequest = {
                savtransaction_id,
                user_id,
                amount,
                timestamp: new Date(),
            };
  
            const updateSavings = await Savings.save(approvedRequest);
  
            if (!updateSavings) {
                throw new Error('Failed to update Savings.');
            }
  
            return res.redirect('/Manager/savingsrequest');
        } else {
            await updatedSavtransaction.destroy();
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