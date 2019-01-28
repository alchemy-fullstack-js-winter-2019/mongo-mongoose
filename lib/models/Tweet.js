const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  handle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 281
  }
});

module.exports = mongoose.model('Tweet', tweetSchema);
