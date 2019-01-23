const Router = require('express').Router;
const Tweets = require('../models/Tweet');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, text } = req.body;
    Tweets
      .create({ handle, text })
      .then(tweet => res.send(tweet))
      .catch(next);
  })
  .get('/:id', (req, res) => {
    const id = req.params.id;
    Tweets.findById(id, (err, tweet) => {
      res.send(tweet);
    });
  })
  .get('/', (req, res) => {
    Tweets.find((err, listOfTweets) => {
      res.send(listOfTweets);
    });
  })
  .put('/:id', (req, res) => {
    const id = req.params.id;
    Tweets
      .findByIdAndUpdate(id, req.body, { new: true })
      .then(updatedTweet => res.send(updatedTweet));
  });
  
