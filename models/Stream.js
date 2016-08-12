const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
  friend: String,
  amount: Number,
  message: String
});

const Stream = mongoose.model('Stream', streamSchema);

module.exports = Stream;
