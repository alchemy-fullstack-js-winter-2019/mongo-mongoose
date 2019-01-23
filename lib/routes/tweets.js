/* eslint-disable no-console*/
const Tweet = require('../models/Tweet');
const { Router } = require('express');

module.exports = Router()

  .post('/', (req, res, next) => {
    const { handle, text } = req.body;
    Tweet.create({ 
      handle, 
      text
    })
      .then(createdTweet => res.send(createdTweet))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Tweet
      .findById(req.params.id)
      .populate('handle')
      .then(foundTweet => {
        res.send(foundTweet);
      })
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Tweet
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('handle')
      .then(updatedTweet => res.send(updatedTweet))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Tweet
      .find()
      .populate('handle')
      .then(tweets => res.send(tweets))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Tweet
      .findByIdAndDelete(req.params._id)
      .populate('handle')
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });




