const { Router } = require('express');
const Tweet = require('../models/Tweet');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, text } = req.body;
    Tweet.create({
      handle,
      text
    }).then(tweet => res.send(tweet)
    ).catch(next);
  })
  .get('/', (req, res) => {
    Tweet.find((err, tweets) => {
      res.send(tweets);
    });
  })
  .get('/:id', (req, res) => {
    Tweet.findById(req.params.id, (err, tweet) => {
      res.send(tweet);
    });
  });
