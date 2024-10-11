const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('D:/komal/komal/backend/models/Transaction.js');

// Route to initialize database with data from API
router.get('/', async (req, res) => {
  try {
    // Fetch data from third-party API
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    // Clear the existing database collection
    await Transaction.deleteMany();

    // Insert the fetched data into the database
    await Transaction.insertMany(transactions);

    res.status(200).send('Database initialized with seed data');
  } catch (error) {
    console.error('Error initializing the database:', error);
    res.status(500).send('An error occurred while initializing the database');
  }
});

module.exports = router;  // Export the router
