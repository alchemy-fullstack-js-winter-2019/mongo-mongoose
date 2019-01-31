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
      .populate('handle')
      .then(tweets => res.send(tweets))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet
      .findById(_id)
      .populate('handle')
      .select('-__v')
      .then(foundTweet => {
        if(!foundTweet) {
          return next(new HttpError(404, `No Tweet found with ${_id}`));
        }
        res.send(foundTweet);
      })
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    const id = req.params.id;
    Tweet
      .findByIdAndUpdate(id, req.body, { new: true })
      .populate('handle')
      .select('-__v')
      .then(updatedTweet => res.send(updatedTweet))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Tweet
      .findByIdAndDelete(id)
      .populate('handle')
      .select('_id text handle')
      .then(deleted => res.send(deleted))
      .catch(next);
  });