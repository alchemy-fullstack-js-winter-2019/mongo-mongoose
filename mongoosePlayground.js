const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/tweets', {
  useNewUrlParser: true });

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    require: true
  },
  text: {
    type: String,
    required: true
  }
});

const Tweet = mongoose.model('Tweet', tweetSchema);

Tweet
  .create({ handle: 'kristin', text: 'what up' })
  .then(createdTweet => {
    console.log(createdTweet);
  })
  .catch(err => console.error(err));

Tweet
  .find()
  .then(tweets => console.log(tweets));

Tweet
  .create({ handle: 'kristin2', text: 'tweet 2' })
  .then(createdTweet => {
    return Tweet.findById(createdTweet._id);
  })
  .then(foundTweet => console.log(foundTweet));

Tweet 
  .create({ handle: 'ROXY', text: 'cat tweet' })
  .then(createdTweet => {
    return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'roxy signing out' });
  })
  .then(updatedTweet => console.log(updatedTweet));

Tweet
  .create({ handle: 'General Roxy', text: 'forward charge!' })
  .then(createdTweet => {
    return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'RETREAAAAAAAAT. I REPEAT, RETREAT! FALL BACK' }, { new: true });
  })
  .then(updatedTweet => console.log(updatedTweet));

Tweet
  .findByIdAndDelete('5c479fd6c40de335002b76d6')
  .then(deleted => console.log(deleted));
