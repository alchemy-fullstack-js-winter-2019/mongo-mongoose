const { Router } = require('express');
const Tweet = require('../models/Tweet');
const { HttpError } = require('../middleware/error');

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

  .get('/:id', (req, res, next) => {
    const id = req.params.id;
    Tweet
      .findById(id)
      .then(tweet => {
        if(!tweet) return next(new HttpError(404, `No tweet found with id ${id}`));
        res.send(tweet);
      })
      .catch(next);
  });
