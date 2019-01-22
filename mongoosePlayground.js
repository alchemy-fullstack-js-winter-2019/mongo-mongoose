const mongoose = require('mongoose'); 
mongooose.connect('mongodb://172.17.0.2:27017/tweets', {
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

Tweet.create({ handle: 'jei', text: 'hello' })
  .then(tweet => {
    console.log(tweet);
  })
  .catch(err => console.error(err));

Tweet.findByIdAndDelete('')
  .then(data => console.log(data));


