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
    .then(createdTweet => console.log('create:', createdTweet))
    .catch(err => console.error(err));

Tweet
    .find()
    .then(tweets => console.log('all tweets:', tweets));

Tweet
    .create({ handle: 'kate', text: 'my first tweet' })
    .then(createdTweet => {
        return Tweet.findOne(createdTweet._id);
    })
    .then(foundTweet => console.log('find one:', foundTweet));

Tweet
    .create({ handle: 'ryan', text: 'my first tweet' })
    .then(createdTweet => {
        return Tweet.findOneAndUpdate(createdTweet._id, { text: 'hi there' }, { new: true });
    })
    .then(updatedTweet => console.log('update:', updatedTweet));

Tweet
    .findOneAndDelete({ _id: '5c47a2755919687b20546698' })
    .then(deleted => console.log('delete:', deleted));

