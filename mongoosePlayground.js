// const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:2000/tweets', { useNewUrlParser: true });

// const tweetSchema = new mongoose.Schema({
//     handle: {
//         type: String, 
//         required: true
//     }, 
//     text: {
//         type: String, 
//         required: true
//     }
// });


// const Tweet = mongoose.model('Tweet', tweetSchema)


// Tweet
//     .create({ handle: 'KananiBoy', text: 'SUUWOOP' })
//     .then(createdTweet => console.log(createdTweet));

// Tweet 
//     .find()
//     .then(foundTweets => console.log(foundTweets)); 

// Tweet
//     .create({ handle: 'XRPMOON', text: 'WHEN MOON?' })
//     .then(createdTweet => {
//         return Tweet.findById(createdTweet._id)
//     })
//     .then(foundTweet => console.log('found tweet', foundTweet));

// Tweet 
//     .create({ handle: 'BTCMOON', text: 'WHEN MOON?' })
//     .then(createdTweet => {
//         return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'NEVER MIND WE NEVER GONNA MOON'})
//     })
//     .then(updatedTweet => console.log(updatedTweet));

// Tweet 
//     .findByIdAndDelete('5c47a18cb92d5237694ff0ca')
//     .then(deleted => console.log(deleted));