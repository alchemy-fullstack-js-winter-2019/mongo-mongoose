const mongoose = require('mongoose');
const Tweet = mongoose.model('Tweet', tweetSchema);

mongoose.connect('mongodb://127.0.0.1:27017/tweets', {
  useNewUrlParser: true
});

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

Tweet
  .create({ handle: 'ryan', text: 'my first tweet' })
  .then(createdTweet => console.log(createdTweet))
  .catch(err => console.error(err));