const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    require: true
  },
  text: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Tweet', tweetSchema);

