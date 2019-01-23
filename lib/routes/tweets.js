const { Router } = require('express');
const Tweet = require('../models/Tweet');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, text } = req.body;
    Tweet
      .create({ handle, text })
      .then(tweet => res.send(tweet))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet
      .findById(_id)
      .then(foundTweet => res.send(foundTweet))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .then(tweet => res.send(tweet))
      .catch(next);
  })
  .put('/:id', (req, res, next) => {
    const { handle, text } = req.body;
    Tweet
      .findByIdAndUpdate(req.params.id, { handle, text })
      .then(updatedTweet => res.send(updatedTweet))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Tweet 
      .delete(req.params.id)
      .then(deletedTweet => res.send(deletedTweet))
      .catch(next);
  });
