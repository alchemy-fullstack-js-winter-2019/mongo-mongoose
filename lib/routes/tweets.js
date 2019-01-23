const { Router } = require('express');
const Tweets = require('../models/Tweets');

module.exports = Router()
  .get('/', (req, res) => {
    Tweets.find((err, listOfTweets) => {
      res.send(listOfTweets);
    });
  });


