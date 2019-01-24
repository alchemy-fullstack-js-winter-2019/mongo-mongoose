const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = Schema({
  handle: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 281
  }
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
