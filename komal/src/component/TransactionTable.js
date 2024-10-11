import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // Make sure to install react-chartjs-2 and chart.js

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState('March'); // Default to March
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10); // Set perPage to 10
  const [statistics, setStatistics] = useState(null);
  const [barChartData, setBarChartData] = useState(null);

  useEffect(() => {
    fetchTransactions();
    fetchStatistics(); // Fetch statistics when the month or page changes
  }, [month, searchTerm, page]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions', {
        params: {
          month,
          search: searchTerm,
          page,
          perPage,
        },
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/statistics', {
        params: {
          month,
        },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/barchart', {
        params: {
          month,
        },
      });
      const { totalAmount, totalSoldItems, totalNotSoldItems } = response.data;
      setBarChartData({
        labels: ['Total Amount', 'Total Sold Items', 'Total Not Sold Items'],
        datasets: [
          {
            label: 'Sales Data',
            data: [totalAmount, totalSoldItems, totalNotSoldItems],
            backgroundColor: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)', 'rgba(255,206,86,1)'],
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  const handleSearch = () => {
    setPage(1); // Reset to first page on search
    fetchTransactions();
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleStatisticsClick = () => {
    fetchStatistics();
    setBarChartData(null); // Clear bar chart data
  };

  const handleBarChartClick = () => {
    fetchBarChartData();
    setStatistics(null); // Clear statistics
  };

  return (
    <div>
      <h2>Transaction Table</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search transactions..."
      />
      <button onClick={handleSearch}>Search</button>

      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{new Date(transaction.dateOfSale).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No transactions found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <button onClick={handlePreviousPage} disabled={page === 1}>
        Previous
      </button>
      <button onClick={handleNextPage}>
        Next
      </button>

      <button onClick={handleStatisticsClick}>Statistics</button>
      <button onClick={handleBarChartClick}>Bar Chart</button>

      <div>
        {statistics && (
          <div>
            <h3>Statistics</h3>
            <p>Total Amount of Sale: {statistics.totalAmount}</p>
            <p>Total Sold Items: {statistics.totalSoldItems}</p>
            <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
          </div>
        )}

        {barChartData && (
          <div>
            <h3>Bar Chart</h3>
            <Bar data={barChartData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
