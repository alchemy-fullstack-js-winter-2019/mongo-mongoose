const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/tweets', {
  useNewUrlParser: true
});
mongoose.connect('mongodb://127.0.0.1:27017/users', {
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
const userSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }, 
  email: {
    type: String,
    required: true
  }
});

const Tweet = mongoose.model('Tweet', tweetSchema);
Tweet
  .create({ handle: 'Daffy-Duck', text: 'chicken al la kingpin' })
  .then(createdTweet =>
    console.log(createdTweet))
  .catch(err => console.error(err));
Tweet
  .find()
  .then(tweets => console.log(tweets));
Tweet
  .create({ handle: 'chicken', text: 'chicken parmesan' })
  .then(createdTweet => {
    return Tweet.findById(createdTweet._id);
  })
  .then(foundTweet => console.log(foundTweet));
Tweet
  .create({ handle: 'chicken', text: 'chicken & dumplease' })
  .then(createdTweet => {
    return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'chicken sticks' });
  })
  .then(updatedTweet => console.log(updatedTweet));
Tweet
  .create({ handle: 'chicken', text: 'chicken salad' })
  .then(createdTweet => {
    return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'chicken noodler' },  { new: true });
  })
  .then(updatedTweet => console.log(updatedTweet));
Tweet
  .findByIdAndDelete('5c47a046f09bb577fc0c3f2d')
  .then(data => console.log(data));




//Users
const Users = mongoose.model('Users', userSchema);
Users
  .create({ handle: 'Daffy-Duck', text: 'chicken al la kingpin' })
  .then(createdUsers =>
    console.log(createdUsers))
  .catch(err => console.error(err));
Users
  .find()
  .then(tweets => console.log(tweets));
Users
  .create({ handle: 'chicken', text: 'chicken parmesan' })
  .then(createdUsers => {
    return Users.findById(createdUsers._id);
  })
  .then(foundUsers => console.log(foundUsers));
Users
  .create({ handle: 'chicken', text: 'chicken & dumplease' })
  .then(createdUsers => {
    return Users.findByIdAndUpdate(createdUsers._id, { text: 'chicken sticks' });
  })
  .then(updatedUsers => console.log(updatedUsers));
Users
  .create({ handle: 'chicken', text: 'chicken salad' })
  .then(createdUsers => {
    return Users.findByIdAndUpdate(createdUsers._id, { text: 'chicken noodler' },  { new: true });
  })
  .then(updatedUsers => console.log(updatedUsers));
Users
  .findByIdAndDelete('5c47a046f09bb577fc0c3f2d')
  .then(data => console.log(data));
