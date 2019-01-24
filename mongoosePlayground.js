const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/localMongo', { useNewUrlParser: true });

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

const Tweets = mongoose.model('Tweet', tweetSchema);

Tweets.create({ handle: 'Jay Jay', text: 1234})
  .then(tweet => {
    console.log(tweet)
  })
  .catch(err => console.error(err))
Tweets.create({ handle: 'hey hey', text: 'anotherone'})
  .then(tweet => {
    console.log(tweet)
  })
  .catch(err => console.error(err))

Tweets
  .findByIdAndDelete("5c47a0359b4f8f684eb426fb")
  .then(data=> console.log(data));
