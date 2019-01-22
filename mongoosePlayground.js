/* eslint-disable no-console*/
const mongoose = require('mongoose');

// Connect to database (useNewUrlParser prevents errors)
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
    .create({ handle: 'katerj', text: 'my first tweet' })
    .then(createdTweet => console.log(createdTweet))
    .catch(err => console.error(err));

Tweet
    .find()
    .then(tweets => console.log(tweets));

Tweet
    .create({ handle: 'kate', text: 'my first tweet' })
    .then(createdTweet => {
        return Tweet.findById(createdTweet._id);
    })
    .then(foundTweet => console.log(foundTweet));

Tweet
    .create({ handle: 'kate', text: 'my first tweet' })
    .then(createdTweet => {
        return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'hi there' });
    })
    .then(updatedTweet => console.log(updatedTweet));


