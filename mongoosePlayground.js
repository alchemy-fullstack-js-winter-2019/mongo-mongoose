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
    .then(createdTweet => console.log(createdTweet));
