const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/tweets', {
  useNewUrlParser: true
});

const tweetsSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const Tweet = mongoose.model('Tweet', tweetsSchema);

Tweet.create({ handle: 'teonna', text: 'hi there' })
  .then(createdTweet => console.log(createdTweet));

Tweet
  .find()
  .then(tweets => console.log(tweets));

Tweet
  .create({ handle: 'teonna', text: 'my first tweet' })
  .then(createdTweet => {
    return Tweet.findById(createdTweet._Id);
  })
  .then(foundTweet => console.log(foundTweet));

Tweet 
  .create({ handle: 'teonna', text: 'BAZINGA' })
  .then(createdTweet => {
    return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'WOOORD' });
  })
  .then(updatedTweet => console.log(updatedTweet));

Tweet
  .create({ handle: 'tt', text: 'My first tweet went a little like this' })
  .then(createdTweet => {
    return Tweet.findByIdAndUpdate(createdTweet._id, {
      text: 'SO MANY EXAMPLES' }, { new: true });
  })
  .then(updatedTweet => console.log(updatedTweet));

Tweet
  .findByIdAndDelete('5c47a1f7fec6f4b47b4954a4')
  .then(deleted => console.log(deleted));
