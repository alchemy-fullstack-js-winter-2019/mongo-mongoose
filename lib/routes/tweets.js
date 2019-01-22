const { Router } = require('express');
const Tweet = require('../models/Tweet');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, tweet } = req.body;
    Tweet.create({
      handle,
      tweet
    }, (err, createdTweet) => {
      if(err) return next(err);      
      res.send(createdTweet);
    });
  })
  .put('/:id', (req, res, next) => {
    Tweet.findByIdAndUpdate(req.params.id, req.body, (err, updatedTweet) => {
      if(err) return next(err);
      res.send(updatedTweet);
    });
  })
  .get('/', (req, res, next) => {
    Tweet.find((err, listOfTweets) => {
      if(err) return next(err);
      res.send(listOfTweets);
    });
  })
  .get('/:id', (req, res, next) => {
    Tweet.findById(req.params.id, (err, tweet) => {
      if(err) return next(err);      
      res.send(tweet);
    });
  })
  .delete('/:id', (req, res, next) => {
    Tweet.findByIdAndDelete(req.params.id, err => {
      if(err) {
        res.send({ deleted: 0 });
        return next(err);
      } else {
        res.send({ deleted: 1 });
      }
    });  
  });
