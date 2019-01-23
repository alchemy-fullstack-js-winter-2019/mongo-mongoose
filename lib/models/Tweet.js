const mongoose = require('mongoose');


const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    require: true
  },
  text: {
    type: String,
    require: true,
    maxlength: 280
  }
});

module.exports = mongoose.model('Tweet', tweetSchema);
