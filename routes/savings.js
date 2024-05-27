const express = require('express');
const savingsController = require('../controller/savingsController');
const Savings = require('../models/savings');

const router = express.Router();

// Route to render the savings page
router.get('/savings', async (req, res) => {
    try {
        const savings = await Savings.findAll();
        res.render('savings', { savings, title: 'Savings' });
    } catch (error) {
        console.error('Error fetching savings:', error);
        res.status(500).send('Error fetching savings.');
    }
});

// Route to handle the creation of savings
router.post('/savings', async (req, res) => {
    try {
        const { userId, amount } = req.body; // Adjust based on your form data
        const newSavings = await Savings.create({ userId, amount });
        res.status(201).json(newSavings);
    } catch (error) {
        console.error('Error creating savings:', error);
        res.status(500).send('Error creating savings.');
    }
});

// Route to fetch savings details by amount (this is unusual; typically, you'd use an ID)
router.get('/savings/:amount', async (req, res) => {
    const { amount } = req.params;
    try {
        const savings = await Savings.findOne({ where: { amount } });
        if (!savings) {
            return res.status(404).send('Savings not found');
        }
        res.render('savingsDetails', { savings, title: 'Savings Details', user: req.user });
    } catch (error) {
        console.error('Error fetching savings:', error);
        res.status(500).send('Error fetching savings.');
    }
});

// Route to update savings (typically by ID, but here by amount for this example)
router.put('/savings/:amount', async (req, res) => {
    const { amount } = req.params;
    const { newAmount } = req.body; // Adjust based on your form data
    try {
        const savings = await Savings.findOne({ where: { amount } });
        if (!savings) {
            return res.status(404).send('Savings not found');
        }
        savings.amount = newAmount;
        await savings.save();
        res.json(savings);
    } catch (error) {
        console.error('Error updating savings:', error);
        res.status(500).send('Error updating savings.');
    }
});

module.exports = router;
