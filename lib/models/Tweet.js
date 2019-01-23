const mongoose = require('mongoose');


const tweetSchema = new mongoose.Schema({
  handle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    enum: ['code', 'JavaScript', 'alchemy'],
    required: false
  }
});

module.exports = mongoose.model('Tweet', tweetSchema);

