const Router = require('express').Router;
const Tweets = require('../models/Tweet');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, text } = req.body;
    Tweets
      .create({ handle, text })
      .then(tweet => res.send(tweet))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    const id = req.params.id;
    Tweets
      .findById(id)
      .then(foundTweet => res.send(foundTweet))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Tweets
      .find()
      .then(tweets => res.send(tweets))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    const id = req.params.id;
    Tweets
      .findByIdAndUpdate(id, req.body, { new: true })
      .then(updatedTweet => res.send(updatedTweet))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Tweets
      .findByIdAndDelete(id)
      .then(deleted => res.send(deleted))
      .catch(next);
  });
  

