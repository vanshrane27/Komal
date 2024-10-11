const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction'); // Assuming you have this model

// API to return pie chart data for unique categories and item counts
router.get('/', async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Month parameter is required' });
    }

    // Get month index from the provided month name
    const monthIndex = new Date(`${month} 1, 2020`).getMonth() + 1;

    // Query for transactions within the selected month
    const pieChartData = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: new Date(new Date().getFullYear(), monthIndex - 1, 1), // Start of the month
            $lt: new Date(new Date().getFullYear(), monthIndex, 1) // Start of the next month
          }
        }
      },
      {
        $group: {
          _id: "$category",  // Group by the category field
          count: { $sum: 1 }  // Count the number of items in each category
        }
      },
      {
        $sort: { count: -1 }  // Sort categories by item count in descending order
      }
    ]);

    res.status(200).json(pieChartData);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ message: 'Error fetching pie chart data' });
  }
});

module.exports = router;
