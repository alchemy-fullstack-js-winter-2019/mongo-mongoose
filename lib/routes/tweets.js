const { Router } = require('express');
const Tweet = require('../models/Tweet');
const { HttpError } = require('../middleware/error');
const ronSwanson = require('../middleware/ronSwanson');

module.exports = Router()
  .post('/', ronSwanson, (req, res, next) => {
    const { handle, text } = req.body;
    if(req.query.random) {
      Tweet
        .create({ handle, text: req.quote })
        .then(tweet => res.send(tweet))
        .catch(next);
    } else {
      Tweet
        .create({ handle, text })
        .then(tweet => res.send(tweet))
        .catch(next);
    }
  })

  .get('/', (req, res, next) => {
    Tweet
      .find()
      .populate('handle', { handle: true })
      .select({ __v: false })
      .then(tweets => res.send(tweets))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    const id = req.params.id;
    Tweet
      .findById(id)
      .populate('handle', { handle: true })
      .select({ __v: false })
      .then(tweet => {
        if(!tweet) return next(new HttpError(404, `No tweet found with id ${id}`));
        res.send(tweet);
      })
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    const id = req.params.id;
    Tweet
      .findOneAndUpdate(id, req.body, { new: true })
      .populate('handle', { handle: true })
      .select({ __v: false })
      .then(tweet => res.send(tweet))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Tweet
      .findByIdAndDelete(id)
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });
