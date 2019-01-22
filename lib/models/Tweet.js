const mongoose = require('mongoose');

const Tweet = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

module.exports = Tweet;
