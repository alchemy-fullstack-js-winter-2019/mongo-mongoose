const { Router } = require('express');
const Tweet = require('../models/Tweet');
const { HttpError } = require('../middleware/error');
const ronSwanson = require('../middleware/ronSwanson');


module.exports = Router()
  .post('/', ronSwanson, (req, res, next) => {
    const { handle, text } = req.body;
    if(req.query.random) {
      Tweet
        .create({ handle, text })
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
      .select('__v: false')
      .then(tweets => res.send(tweets))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet
      .findById(_id)
      .populate('handle', { handle: true })
      .select({ __v: false })
      .then(foundTweet => {
        if(!foundTweet) {
          return next(new HttpError(404, `No Tweet found with ${_id}`));
        }
        res.send(foundTweet);
      })
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    const { handle, text } = req.body;
    Tweet
      .findByIdAndUpdate(req.params.id, { handle, text })
      .populate('handle', { handle: true })
      .select({ __v: false })
      .then(updatedTweet => res.send (updatedTweet))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Tweet
      .findByIdAndDelete(req.params.id)
      .then(deleted => res.send(deleted))
      .catch(next);
  });




