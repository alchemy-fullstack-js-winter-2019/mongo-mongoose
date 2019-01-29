/* eslint-disable no-console*/

// class or Models get uppercase letters in file name

// Require mongoose
const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  handle: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxLength: 280
  }
});



module.exports = mongoose.model('Tweet', tweetSchema);


