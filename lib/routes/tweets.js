const Router = require('express').Router;
const Tweet = require('../models/Tweet');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, text } = req.body;
    Tweet
      .create({ handle, text })
      .then(tweet => res.send(tweet))
      .catch(next);
  })
  // .get('/', (req, res) => {
  //   Tweet.find((err, tweets) => {
  //     res.send(tweets);
  //   });
  // })
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .then(tweets => res.send(tweets))
      .catch(next);
  })
  // .get('/:id', (req, res) => {
  //   const _id = req.params.id;
  //   Tweet.findById(_id, (err, tweet) => {
  //     res.send(tweet);
  //   });
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet
      .findById(_id)
      .then(tweet => res.send(tweet))
      .catch(next);
  
  });
