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
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .select('id text')
      .populate('handle', '-email -_id -name -__v')
      .then(tweets => res.send(tweets))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet
      .findById(_id)
      .select('id text')
      .populate('handle', '-email -_id -name -__v')
      .then(tweet => {
        res.send(tweet);
      })
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    const _id = req.params.id;
    const { text } = req.body;
    Tweet
      .findByIdAndUpdate(_id, { text }, { new: true })
      .select('id text')
      .populate('handle', '-email -_id -name -__v')
      .then(updatedTweet => res.send(updatedTweet))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet
      .findByIdAndDelete(_id)
      .then(() => res.send({ deleted : 1 }))
      .catch(next);
  });


