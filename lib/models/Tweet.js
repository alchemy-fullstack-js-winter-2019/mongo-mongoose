const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  handle: {
    type: Object,
    ref: 'User',
    required: true
  },
  text: {
    type: Object,
    required: true,
    maxlength: 280
  }
  
});

module.exports = mongoose.model('Tweet', tweetSchema);



