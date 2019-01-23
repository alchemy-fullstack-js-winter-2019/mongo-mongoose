const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/tweets', {
  useNewUrlParser: true
});

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  }
});

const Tweet = mongoose.model('Tweet', tweetSchema);

Tweet.create({ handle: 'DEE', text: 'hi' })
.then(createdTweet => {
  return
Tweet.findByIdAndUpdate(createdTweet._id, 
  { text: 'hi there' }, { new: true })
})
  .then(updatedTweet => 
    console.log(updatedTweet));

