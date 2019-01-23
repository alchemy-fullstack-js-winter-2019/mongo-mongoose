const mongoose = require('mongoose');


const tweetSchema = new mongoose.Schema({
  handle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Tweet', tweetSchema);

