const { Router } = require('express');
const Tweet = require('../models/Tweet');



module.exports = Router()
//create a tweet
.post('/', (req, res, next) => {
  const {handle, text} = req.body;
  Tweet
  .create({ handle, text })
  .then(tweet => res.send(tweet))
  .catch(next);
})
//finds all the tweets
.get('/', (req, res, next) => {
  Tweet
  .find()
  .then(tweets => res.send(tweets))
  .catch(next);
})
//get tweet by id
.get('/:id', (req, res, next) => {
  const _id = req.params.id;
  Tweet
  .findById(_id)
  .then(foundTweet => {
    if (!foundTweet) {
      return next(new HttpError(404, `Nothing was found with that ${_id}`))
    }
    res.send(foundTweet)
    })
      .catch(next);
})
//find by id and update
.patch('/:id', (req, res, next) => {
  Tweet
  .findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new:true }
    )
  .then(updatedTweet => res.send(updatedTweet)
   )
   .catch(next);
})
