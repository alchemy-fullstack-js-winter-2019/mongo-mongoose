const Tweets = require('../models/Tweet');
const mongoose = require('mongoose');
const { Router } = require('express');

module.exports = Router() 
  .post('/', (req, res, next) => {
    const { handle, text } = req.body;
    Tweets.create({ handle, text })
    .then(tweet => {
      res.send(tweet);
    })
    .catch(err => {
      next(err);
    });
  })
  .get('/', (req, res, next) => {
    Tweets.find((err, listOfTweets) => {
      res.send(listOfTweets)
    });
    
  })
  .get('/', (req, res, next) => {
    Tweet.findById(req.params.id, (err, tweet) => {
      if(err) {
        if(err.code === 'ENOENT') {
          return next(new HttpError(400, `Bad Id: ${req.params.id}`));
        } else {
          return next(err);
        }
      }
      res.send(tweet);
  });
  })
  .put('/:id', (req, res) => {
    const { handle, text } = req.body;
    Tweet.findByIdAndUpdate(req.params.id,
      { handle, text },
      (err, updated) => res.send(updated));
  })
  .delete('/:id', (req, res) => {
    Tweet.findByIdAndDelete(req.params._id, (err, data) => {
      if(err) return next(err);
      res.send(data);
    });
  });

