const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
  amount: { type: Number, unique: false },
  message: String,
  bank: String,
  banker: String
}, { timestamps: true });


//amount validation

const Debt = mongoose.model('Debt', debtSchema);

module.exports = Debt;
