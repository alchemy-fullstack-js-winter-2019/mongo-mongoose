/* eslint-disable no-console*/
const Tweet = require('../models/Tweet');
const { Router } = require('express');
const ronSwanson = require('../middleware/ronSwanson');
const { HttpError } = require('../middleware/error');


const patcher = (body, fields) => {
  return Object.keys(body)
    .reduce((acc, key) => {
      if(fields.includes(key) && body[key]) {
        acc[key] = body[key];
      }
      return acc;
    }, {});
};

module.exports = Router()

  .post('/', ronSwanson, (req, res, next) => {
    const { handle, text } = req.body;
    if(req.query.random) {
      Tweet
        .create({ handle, text: req.quote })
        .then(tweet => {
          res.send(tweet);
        })
        .catch(next);
    }
    Tweet
      .create({ 
        handle, 
        text
      })
      .then(createdTweet => res.send(createdTweet))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Tweet
      .findById(req.params.id)
      .populate('handle', { handle: true })
      .select({ __v: false })
      .then(foundTweet => {
        if(!foundTweet) {
          return next(new HttpError(404, `No tweet with id ${req.params.id}`));
        }
        res.send(foundTweet);
      })
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    const patched = patcher(req.body, ['handle', 'text']);
    Tweet
      .findByIdAndUpdate(req.params.id, patched, { new: true })
      .populate('handle', { handle: true })
      .select({ __v: false })
      .then(updatedTweet => {
        res.send(updatedTweet);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Tweet
      .find()
      .populate('handle', { handle: true })
      .select({ __v: false })
      .then(tweets => res.send(tweets))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Tweet
      .findByIdAndDelete(req.params._id)
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });




