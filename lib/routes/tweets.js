const { Router } = require('express');
const Tweet = require('../models/Tweet');
const { HttpError } = require('../middleware/error');


module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, text } = req.body;
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
    Tweet
    .findById(_id)
    .then(foundTweet => {
      res.send(foundTweet)
    })
    .catch(next);
  })
  .put('/:id', (req, res, next) => {
    const { handle, text } = req.body;
    Tweet
    .findByIdAndUpdate(req.params.id, { handle, text }, (err, updatedTweet) => {
      res.send(updatedTweet);
    })
  .catch(next);
  });




