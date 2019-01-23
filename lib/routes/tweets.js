const { Router } = require('express');
const Tweet = require('../models/Tweet');



module.exports = Router()
.post('/', (req, res, next) => {
  const {handle, text} = req.body;
  Tweet
  .create({ handle, text })
  .then(tweet => res.send(tweet))
  .catch(next);
})
.get('/', (req, res, next) => {
  Tweet
  .find()
  .then(tweets => res.send(tweets))
  .catch(next);
})
.get('/:id', (req, res, next) => {
  const _id = req.params.id;
  Tweet.findById(_id)
  .then(foundTweet => {
    if (!foundTweet) {
      return next(new HttpError(404, `Nothing was found with that ${_id}`))
    }
    res.send(foundTweet)
    })
      .catch(next);
});
