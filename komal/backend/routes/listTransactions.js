const express = require('express');
const router = express.Router();
const Transaction = require('D:/komal/komal/backend/models/Transaction.js');

// Array to convert month number to month name
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Route to list transactions with search, pagination, and month filter
router.get('/', async (req, res) => {
  try {
    const { page = 1, perPage = 10, search = '', month } = req.query;  // Get query params

    // Create an aggregation pipeline
    let matchStage = {};

    // If search text is provided, filter by title, description, or price
    if (search) {
      const regex = new RegExp(search, 'i');  // Case-insensitive search
      matchStage.$or = [
        { title: regex },
        { description: regex },
        { price: { $regex: regex } },
      ];
    }

    // If month is provided as text (e.g., "January"), convert it to the corresponding number
    if (month) {
      const monthIndex = monthNames.indexOf(month) + 1;  // Convert month name to month number
      // Check if the monthIndex is between 1 and 12
      if (monthIndex > 0 && monthIndex < 13) {
        matchStage.$expr = {
          $eq: [{ $month: "$dateOfSale" }, monthIndex]  // Match the month directly
        };
      } else {
        return res.status(400).json({ message: 'Invalid month name' });
      }
    }

    // Fetch transactions based on the filter with pagination using aggregation
    const transactions = await Transaction.aggregate([
      { $match: matchStage },
      { $skip: (page - 1) * perPage },
      { $limit: parseInt(perPage) }
    ]);

    // Get total count for pagination purposes
    const totalTransactions = await Transaction.countDocuments(matchStage);

    res.status(200).json({
      totalTransactions,
      totalPages: Math.ceil(totalTransactions / perPage),
      currentPage: parseInt(page),
      transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error); // Log the complete error object
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

module.exports = router;
