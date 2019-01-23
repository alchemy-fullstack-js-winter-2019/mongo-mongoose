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
      .then(createdTweet => {
        res.send(createdTweet);
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Tweet.findById(req.params.id)
      .then(foundTweet => {
        res.send(foundTweet);
      })
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Tweet.findByIdAndUpdate(req.params.id)
    .then(foundTweet => {
      
    })
  })




