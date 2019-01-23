const { Router } = require('express');
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
  .get('/:id', (req, res) => {
    res.end(req.params.id);
  })
  .get('/', (req, res) => {
    Tweets.find((err, listOfTweets) => {
      res.send(listOfTweets);
    });
  })
  .patch('/:id', (req, res, next) => {
    Tweets.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedTweet) => {
      if(err) return next(err);
      res.send(updatedTweet);
    });
  })
  .delete('/:id', (req, res, next) => {
    Tweets.findByIdAndDelete(req.params.id, (err) => {
      if(err) return next(err);
      res.send({ deleted: 1 });
    });
  });
