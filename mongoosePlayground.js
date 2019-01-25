/* eslint-disable no-console */
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/tweets', {
  useNewUrlParser: true
});

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    require: true
  },
  text: {
    type:String,
    require:true
  }
});

const Tweet = mongoose.model('Tweet', tweetSchema);

Tweet.create({ handle: 'ryan', text: 1234 })
  .then(tweet => {
    
    console.log(tweet);
  })
  .catch(err => console.error(err));

Tweet
  .find({ handle: 'ryan' }) //query that finds only tweets by ryan
  .then(tweets => console.log(tweets));


