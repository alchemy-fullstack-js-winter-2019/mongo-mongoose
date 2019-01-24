const mongoose = require('mongoose');

//NOTE:sets properties for tweets which will be sent to db
//once Schema is created we can used the create method from mongoose to make an instance of Tweet.create to make an instance.
const tweetSchema = new mongoose.Schema({
  handle: {
    //this links tweets wit users 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 281
  }
});

//create a model
module.exports = mongoose.model('Tweet', tweetSchema);
