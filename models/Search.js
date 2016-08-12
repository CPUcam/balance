const mongoose = require('mongoose');
const crypto = require('crypto');

const searchSchema = new mongoose.Schema({
  name: String,
  email: String,
  picture: String
}, { timestamps: true });

searchSchema.methods.gravatar = function (size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const Search = mongoose.model('Search', searchSchema);

module.exports = Search;
