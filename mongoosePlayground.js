const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/tweets', { useNewUrlParser: true });


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
  .create({ handle: 'Aaron', text: 'Hello World' })
  .then(createdTweet => console.log(createdTweet));


Tweet
  .find()
  .then(tweets => console.log(tweets));

Tweet
  .create({ handle: 'Aaron', text: 'Hello World!' })
  .then(createdTweet => {
    return Tweet.findById(createdTweet._id);
  })
  .then(foundTweet => console.log(foundTweet));

Tweet
  .create({ handle: 'Aaron', text: 'Hello World?' })
  .then(createdTweet => {
    return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'hi there' });
  })
  .then(updatedTweet => console.log(updatedTweet));

Tweet
  .create({ handle: 'ryan', text: 'my first tweet' })
  .then(createdTweet => {
    return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'hi there' },  { new: true });
  })
  .then(updatedTweet => console.log(updatedTweet));

Tweet
  .findByIdAndDelete('5c479cd5345660da94afdbc4')
  .then(deleted => console.log(deleted));
