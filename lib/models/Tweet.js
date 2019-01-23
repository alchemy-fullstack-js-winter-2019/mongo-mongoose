const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  handle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    maxlength: 280
  }
});

module.exports = mongoose.model('Tweet', tweetSchema);



