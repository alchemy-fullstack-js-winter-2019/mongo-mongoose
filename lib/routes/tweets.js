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
  .get('/:id', (req, res) => {
    const _id = req.params.id;
    Tweet.findById(_id, (err, foundTweet) => {
      res.send(foundTweet);
    });
  });

