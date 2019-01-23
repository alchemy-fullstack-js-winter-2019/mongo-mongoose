const { Router } = require('express');
const Tweet = require('../models/Tweet');



module.exports = Router()

weet
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
  return Tweet.findById(createdTweet._id)
})
.then(foundTweet => console.log(foundTweet));
Tweet
.create({ handle: 'chicken', text: 'chicken & dumplease' })
.then(createdTweet => {
  return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'chicken sticks' })
})
.then(updatedTweet => console.log(updatedTweet));
Tweet
.create({ handle: 'chicken', text: 'chicken salad' })
.then(createdTweet => {
  return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'chicken noodler' },  { new: true })
})
.then(updatedTweet => console.log(updatedTweet));
Tweet
.findByIdAndDelete('5c47a046f09bb577fc0c3f2d')
.then(data => console.log(data))