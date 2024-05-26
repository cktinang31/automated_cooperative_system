const Savings= require('../models/savings');

const savings = async (req, res) => {
    try {
        const { user_id, amount, interest, loan_id } = req.body;
    
        
        const newSavingsData = {
        user_id,
        amount: amount || 500, 
        interest,
        loan_id,
        timestamp: new Date()
        };
    
        const newSavings = await Savings.create(newSavingsData);
    
        console.log('New Savings:', newSavings);
        res.send('Savings created successfully.');
    } catch (error) {
        console.error('Error creating savings:', error);
        res.status(500).send('Error creating savings.');
    }
    };
    
    

module.exports = {
    Savings,
}