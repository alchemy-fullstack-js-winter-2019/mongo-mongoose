/* eslint-disable no-console*/
const Tweet = require('../models/Tweet');
const { Router } = require('express');

module.exports = Router()

  .post('/tweets', (req, res, next) => {
    const { handle, text } = req.body;
    Tweet.create({ 
      handle, 
      text
    })
      .then(createdTweet => {
        res.send(createdTweet);
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Tweet
      .findById(req.params.id)
      .then(foundTweet => {
        res.send(foundTweet);
      })
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Tweet.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedTweet => {
        res.send(updatedTweet);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Tweet.find()
      .then(tweets => {
        res.send(tweets);
      })
      .catch(next);
  });




