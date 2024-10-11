const express = require('express');
const router = express.Router();
const Transaction = require('D:/komal/komal/backend/models/Transaction.js'); // Adjust path as necessary

// Route to list transactions with search, pagination, and month filter
router.get('/api/transactions', async (req, res) => {
  try {
    const { page = 1, perPage = 10, search = '', month } = req.query;  // Get query params

    // Create a filter object
    let filter = {};

    // If search text is provided, filter by title, description, or price
    if (search) {
      const regex = new RegExp(search, 'i');  // Case-insensitive search
      filter.$or = [
        { title: regex },
        { description: regex },
        { price: { $regex: regex } },
      ];
    }

    // If month is provided, filter by month regardless of the year
    if (month) {
        const monthIndex = new Date(`${month} 1`).getMonth() + 1; // Get month number from string (1-12)
        if (monthIndex > 0 && monthIndex < 13) {
          // Match dateOfSale month without considering the year
          filter.dateOfSale = {
            $expr: {
              $eq: [{ $month: "$dateOfSale" }, monthIndex]
            }
          };
        } else {
          return res.status(400).json({ message: 'Invalid month name' });
        }
      }

    // Fetch transactions based on the filter with pagination
    const transactions = await Transaction.find(filter)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    // Get total count for pagination purposes
    const totalTransactions = await Transaction.countDocuments(filter);

    res.status(200).json({
      totalTransactions,
      totalPages: Math.ceil(totalTransactions / perPage),
      currentPage: parseInt(page),
      transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

module.exports = router;
