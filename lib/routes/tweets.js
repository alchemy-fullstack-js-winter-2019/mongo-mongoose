const Router = require('express').Router;
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
    const id = req.params.id;
    Tweet
      .findById(id)
      .populate('handle')
      .then(foundTweet => res.send(foundTweet))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .then(tweets => res.send(tweets))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    const id = req.params.id;
    Tweet
      .findByIdAndUpdate(id, req.body, { new: true })
      .populate('handle')
      .then(updatedTweet => res.send(updatedTweet))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Tweet
      .findByIdAndDelete(id)
      .populate('handle')
      .then(deleted => res.send(deleted))
      .catch(next);
  });
  

