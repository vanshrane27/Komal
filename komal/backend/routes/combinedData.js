const express = require('express');
const router = express.Router();
const axios = require('axios');

// Combined API to fetch and return data from all the previous APIs
router.get('/', async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Month parameter is required' });
    }

    // Base URL for the APIs (assuming they are hosted on the same server)
    const baseURL = 'http://localhost:5000';

    // Fetch data from all three APIs in parallel
    const [statisticsData, barChartData, pieChartData] = await Promise.all([
      axios.get(`${baseURL}/statistics`, { params: { month } }),
      axios.get(`${baseURL}/bar-chart`, { params: { month } }),
      axios.get(`${baseURL}/pie-chart`, { params: { month } })
    ]);

    // Combine the results into one final response
    const combinedData = {
      statistics: statisticsData.data,
      barChart: barChartData.data,
      pieChart: pieChartData.data
    };

    // Send the combined response
    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ message: 'Error fetching combined data' });
  }
});

module.exports = router;
