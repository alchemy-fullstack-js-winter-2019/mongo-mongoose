const Tweets = require('../../lib/models/Tweet');
const mongoose = require('mongoose');
const { Router } = require('express');
const { HttpError } = require('../../lib/middleware/error');

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
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet.findById(_id)
    .then(foundTweet => req.send(foundTweet))
    .catch(next);
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

