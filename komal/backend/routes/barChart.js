const express = require('express');
const router = express.Router();
const Transaction = require('D:/komal/komal/backend/models/Transaction.js'); // Assuming you have this model

// API to return bar chart data for price ranges
router.get('/', async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Month parameter is required' });
    }

    // Get month index from the provided month name
    const monthIndex = new Date(`${month} 1, 2020`).getMonth() + 1;

    // Query for transactions within the selected month
    const transactions = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: new Date(new Date().getFullYear(), monthIndex - 1, 1), // Start of the month
            $lt: new Date(new Date().getFullYear(), monthIndex, 1) // Start of the next month
          }
        }
      },
      {
        $bucket: {
          groupBy: "$price",  // Group by the price field
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],  // Price ranges
          default: "901-above",  // Any price higher than 900
          output: {
            count: { $sum: 1 }  // Count the number of items in each range
          }
        }
      }
    ]);

    // Prepare the response in the format required for a bar chart
    const barChartData = [
      { priceRange: "0-100", count: 0 },
      { priceRange: "101-200", count: 0 },
      { priceRange: "201-300", count: 0 },
      { priceRange: "301-400", count: 0 },
      { priceRange: "401-500", count: 0 },
      { priceRange: "501-600", count: 0 },
      { priceRange: "601-700", count: 0 },
      { priceRange: "701-800", count: 0 },
      { priceRange: "801-900", count: 0 },
      { priceRange: "901-above", count: 0 }
    ];

    // Map the transaction result to bar chart data
    transactions.forEach(bucket => {
      if (bucket._id === "901-above") {
        barChartData[9].count = bucket.count;
      } else if (bucket._id < 100) {
        barChartData[0].count = bucket.count;
      } else {
        const index = Math.floor(bucket._id / 100);
        if (index >= 1 && index <= 9) {
          barChartData[index].count = bucket.count;
        }
      }
    });

    res.status(200).json(barChartData);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).json({ message: 'Error fetching bar chart data' });
  }
});

module.exports = router;
