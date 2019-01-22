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

// Tweet
//   .create({ handle: 'paige', text: 'my first tweet' })
//   .then(createdTweet => console.log(createdTweet));

// Tweet
//   .find()
//   .then(tweets => console.log(tweets));

// Tweet
//   .create({ handle: 'paige', text: 'my second tweet' })
//   .then(createdTweet => {
//     return Tweet.findById(createdTweet._id);
//   })
//   .then(foundTweet => console.log(foundTweet));

// Tweet
//   .create({ handle: 'paige', text: 'my yoyo tweet' })
//   .then(createdTweet => {
//     return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'my yogurt tweet' });
//   })
//   .then(updatedTweet => console.log(updatedTweet));

Tweet
  .findByIdAndDelete('5c479d0226b0befecc1b51e6')
  .then(deleted => console.log(deleted));
