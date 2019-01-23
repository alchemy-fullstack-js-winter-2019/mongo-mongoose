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
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .then(tweets => res.send(tweets))
      .catch(next);
  })



