const { Router } = require('express');
const Tweet = require('../models/Tweet');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, text, tag } = req.body;
    Tweet
      .create({ handle, text, tag })
      .then(tweet => res.send(tweet))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    Tweet
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('handle', '-email -name -_id -__v')
      .select({ '__v': false })
      .then(updatedTweet => {
        res.send(updatedTweet);
      })
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .populate('handle', '-email -name -_id -__v')
      .select({ '__v': false })
      .then(listOfTweets => {
        res.send(listOfTweets);
      })
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Tweet
      .findById(req.params.id)
      .populate('handle', '-email -name -_id -__v')
      .select({ '__v': false })
      .then(foundTweet => {
        res.send(foundTweet);
      })
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Tweet.findByIdAndDelete(req.params.id)
      .then(() => {
        res.send({ deleted: 1 });
      })
      .catch(next);
  });  
