const mongoose = require('mongoose');


const tweetSchema = new mongoose.Schema({
  handle: {
    type: mongoose.Schema.Types.ObjectId, //mongo object id no longer a string. this object id refers to a user
    ref: 'User',
    require: true
  }, 
  text: {
    type: String,
    require: true,
    maxlength: 280
  }
});

module.exports = mongoose.model('Tweet', tweetSchema);
