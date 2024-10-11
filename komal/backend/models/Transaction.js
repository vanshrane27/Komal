const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  category: String,
  date: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
