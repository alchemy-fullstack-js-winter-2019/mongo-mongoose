const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/tweets', { 
  useNewUrlParser: true 
});


const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,quired: true
  },
  text: {
    type: String,
    required: true
  }
});

const Tweet = mongoose.model('Tweet', tweetSchema);

Tweet.create({ handle: 'carmen', text: 1234})
  .then(tweet => {
    console.log(tweet)
  })
  .catch(err => console.error(err));

Tweet
  .find({ handle: 'carmen' })
  .then(tweets => console.log(tweets));
  

Tweet
  .create({ handle: 'carmen', text: 'my first tweet' }) 
  .then(createdTweet => {
    return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'hi there' })
  }) 
  .then(updatedTweet => console.log(updatedTweet));
    