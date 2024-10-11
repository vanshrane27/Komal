const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const transactionRoutes = require('D:/komal/komal/backend/routes/transactions.js');
const seedDataRoute = require('D:/komal/komal/backend/routes/seedData.js');  // Import the router
const listTransactionsRoute = require('D:/komal/komal/backend/routes/listTransactions.js');  // Import the new route
const statisticsRoutes = require('D:/komal/komal/backend/routes/statistics.js');  // Import the new route
const barChartRoutes = require('D:/komal/komal/backend/routes/barChart.js');
const pieChartRoutes = require('D:/komal/komal/backend/routes/pieChart.js');
const combinedDataRoutes = require('D:/komal/komal/backend/routes/combinedData.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(transactionRoutes); // Use the transaction routes
// Use the transactions route
app.use('/transactions', listTransactionsRoute);
// Use the statistics route
app.use('/statistics', statisticsRoutes);
// Use the bar chart route
app.use('/bar-chart', barChartRoutes);
// Use the pie chart route
app.use('/pie-chart', pieChartRoutes);
// Use the combined data route
app.use('/combined-data', combinedDataRoutes);
// Your MongoDB connection string here
const MONGO_URI = 'mongodb://localhost:27017/transactions_db';

// Connect to MongoDB (make sure to update with your connection string)
mongoose.connect('mongodb://localhost:27017/transactions_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use the seed data route
app.use('/initialize-db', seedDataRoute);  // Make sure this is correct

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
