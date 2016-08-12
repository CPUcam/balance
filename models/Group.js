const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: String,
  one: String,
  two: String,
  three: String,
  four: String,
  onetwo: Number,
  onethree: Number,
  onefour: Number,
  twothree: Number,
  twofour: Number,
  threefour: Number
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
