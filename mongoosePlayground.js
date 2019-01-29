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
// Tweet.create({ handle: 'marcy', text: 'my first tweet' })
//     .then(createdTweet => console.log(createdTweet))
//     .catch(err => console.log(err));

// Tweet.findByIdAndDelete('5c47a17363e258ecc003d0fb').then(data => console.log(data));

Tweet.create({ handle: 'marcy', text: 'my first tweet' })
    .then(createdTweet => {
        return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'my second tweet' }, { new: true });
    })
    // eslint-disable-next-line no-console
    .then(updatedTweet => console.log(updatedTweet));
