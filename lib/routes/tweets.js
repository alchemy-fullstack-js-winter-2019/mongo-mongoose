const Router = require('express').Router;
const Tweet = require('../models/Tweet');

module.exports = Router()
  .get('/', (req, res) => {
    Tweet.find((err, tweets) => {
      res.send(tweets);
    });
  });
