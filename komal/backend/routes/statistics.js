const express = require('express');
const router = express.Router();
const Transaction = require('D:/komal/komal/backend/models/Transaction.js'); // Assuming you have this model

// Route to get statistics for a selected month
router.get('/', async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Month parameter is required' });
    }

    // Get month index from the provided month name
    const monthIndex = new Date(`${month} 1, 2020`).getMonth() + 1;

    // Calculate total sale amount for the selected month
    const totalSales = await Transaction.aggregate([
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
          _id: null,
          totalAmount: { $sum: '$price' }, // Sum of prices for sold items
          soldItemsCount: { $sum: 1 } // Count of sold items
        }
      }
    ]);

    // Calculate total not sold items for the selected month
    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: {
        $gte: new Date(new Date().getFullYear(), monthIndex - 1, 1), // Start of the month
        $lt: new Date(new Date().getFullYear(), monthIndex, 1) // Start of the next month
      },
      price: 0  // Assuming items with price 0 are not sold
    });

    res.status(200).json({
      totalSaleAmount: totalSales.length > 0 ? totalSales[0].totalAmount : 0,
      totalSoldItems: totalSales.length > 0 ? totalSales[0].soldItemsCount : 0,
      totalNotSoldItems
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

module.exports = router;
