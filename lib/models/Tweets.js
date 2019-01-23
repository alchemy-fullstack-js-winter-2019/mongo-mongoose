const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 281
  }
});

const Tweets = mongoose.model('Tweet', tweetSchema);

module.exports = Tweets;
