const mongoose = require('mongoose');
require('dotenv').config();
require('./lib/utils/connect')();

mongoose.connect('mongodb://127.0.0.1:27017/tweets', {
  useNewUrlParser: true
});

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const Tweet = mongoose.model('Tweet', tweetSchema);

Tweet
  .findById('5c47bab120216b6bcf6bd6de')
  .then(data => console.log('data', data));
