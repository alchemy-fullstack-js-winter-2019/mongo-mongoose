const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    maxLength: 280
  },
  email: {
    type: String,
    required: true,
    maxLength: 280
  }
});

module.exports = mongoose.model('User', tweetSchema);
