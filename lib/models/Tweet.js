/* eslint-disable no-console*/

// class or Models get uppercase letters
const mongoose = require('mongoose');

// Connect to database (useNewUrlParser prevents errors)
mongoose.connect('mongodb://127.0.0.1:27017/tweets', { useNewUrlParser: true });

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxLength: 280
  }
});

module.exports = mongoose.model('Tweet', tweetSchema);


