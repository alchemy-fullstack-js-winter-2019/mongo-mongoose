const { Router } = require('express');
const Tweet = require('../models/Tweet');

const patcher = (body, fields) => {
  return Object.keys(body)
    .reduce((acc, key) => {
      if(fields.includes(key) && body[key]) {
        acc[key] = body[key];
      }
      return acc;
    }, {});
};

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
      .populate('handle')
      .then(foundTweet => res.send(foundTweet))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .populate('handle')
      .then(tweets => res.send(tweets))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    const patched = patcher(req.body, ['handle', 'text']);
    Tweet
      .findByIdAndUpdate(req.params.id, patched, { new: true })
      .populate('handle')
      .then(updatedTweet => res.send(updatedTweet))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Tweet
      .findByIdAndDelete(req.params.id)
      .populate('handle')
      .then(deleted => res.send(deleted))
      .catch(next);
  });
