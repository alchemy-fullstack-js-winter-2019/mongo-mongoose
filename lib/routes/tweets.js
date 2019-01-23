const { Router } = require('express');
const { HttpError } = require('../middleware/error');
const Tweets = require('../models/Tweets');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, text } = req.body;
    Tweets
      .create({ handle, text })
      .then(tweet => {
        res.send(tweet);
      })
      .catch(err => {
        next(err);
      });
  })
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweets
      .findById(_id)
      .populate('handle')
      .then(foundTweet => {
        if(!foundTweet) {
          return next(new HttpError(404, `No Tweet found with id: ${_id}`));
        }
        res.send(foundTweet);
      })
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Tweets
      .find()
      .populate()
      .then(tweets => res.send(tweets))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    Tweets.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedTweet) => {
      if(err) return next(err);
      res.populate('handle').send(updatedTweet);
    });
  })
  .delete('/:id', (req, res, next) => {
    Tweets.findByIdAndDelete(req.params.id)
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });
