/* eslint-disable no-console */
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
const User = mongoose.model('User', userSchema);

Tweet
  .create({ handle: 'abel', text: 'my first tweet' })
  .then(createdTweet => {
    console.log(createdTweet);
  })
  .catch(err => console.error(err));
Tweet
  .find({ handle: 'abel' })
  .then(tweets => console.log(tweets));
  
Tweet
  .create({ handle: 'abel', text: 'my first tweet' })
  .then(createdTweet => {
    return Tweet.findById(createdTweet._id);
  })
  .then(foundTweet => console.log(foundTweet));

Tweet
  .create({ handle: 'abel', text: 'my first tweet' })
  .then(createdTweet => {
    return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'hi there' });
  })
  .then(updatedTweet => console.log(updatedTweet));

Tweet
  .create({ handle: 'abel', text: 'my first tweet' })
  .then(createdTweet => {
    return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'hi there' });
  })
  .then(updatedTweet => console.log(updatedTweet));

Tweet
  // eslint-disable-next-line no-undef
  .findByIdAndDelete(FOUND_ID)
  .then(deleted => console.log(deleted));


User
  .create({ 
    handle: 'abelq16',
    name: 'abel',
    email: 'abel.j.quintero@gmail.com' })
  .then(createdUser => {
    console.log(createdUser);
  })
  .catch(err => console.error(err));
User
  .find({ handle: 'abelq16' })
  .then(Users => console.log(Users));
  
User
  .create({ handle: 'abelq16', text: 'my first User' })
  .then(createdUser => {
    return User.findById(createdUser._id);
  })
  .then(foundUser => console.log(foundUser));

User
  .create({ 
    handle: 'abelq16',
    name: 'abel',
    email: 'abel.j.quintero@gmail.com'
  })
  .then(createdUser => {
    return User.findByIdAndUpdate(createdUser._id, { text: 'hi there' });
  })
  .then(updatedUser => console.log(updatedUser));

User
  .create({ 
    handle: 'abelq16',
    name: 'abel',
    email: 'abel.j.quintero@gmail.com'
  })
  .then(createdUser => {
    return User.findByIdAndUpdate(createdUser._id, { text: 'hi there' });
  })
  .then(updatedUser => console.log(updatedUser));

User
  // eslint-disable-next-line no-undef
  .findByIdAndDelete(FOUND_ID)
  .then(deleted => console.log(deleted));
