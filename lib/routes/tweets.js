const { Router } = require('express');
const Tweet = require('../models/Tweet');

module.exports = Router()
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .then(tweets => res.send(tweets))
      .catch(next);
  });
