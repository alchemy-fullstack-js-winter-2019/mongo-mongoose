const mongoose = require('mongoose');

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

  const Tweet = mongoose.model('Tweet', tweetSchema);

  Tweet
    .create({ handle: 'abel', text: 'my first tweet' })
    .then(createdTweet => {
      console.log(createdTweet)
    })
    .catch(err => console.error(err));
  Tweet
    .find({ handle: 'abel' })
    .then(tweets => console.log(tweets));
  
  Tweet
    .create({ handle: 'abel', text: 'my first tweet' })
    .then(createdTweet => {
      return Tweet.findById(createdTweet._id)
    })
    .then(foundTweet => console.log(foundTweet));

  Tweet
    .create({ handle: 'abel', text: 'my first tweet' })
    .then(createdTweet => {
      return Tweet.findByIdAndUpdate(createdTweet._id, {text: 'hi there' })
    })
    .then(updatedTweet => console.log(updatedTweet));

  Tweet
    .create({ handle: 'abel', text: 'my first tweet' })
    .then(createdTweet => {
      return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'hi there' })
    })
    .then(updatedTweet => console.log(updatedTweet));

  Tweet
    .findByIdAndDelete(FOUND_ID)
    .then(deleted => console.log(deleted));