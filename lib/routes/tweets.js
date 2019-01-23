const { Router } = require('express');
const Tweet = require('../models/Tweet');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, text } = req.body;
    Tweet
      .create({ handle, text })
      .then(tweet => res.send(tweet))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    Tweet
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('handle', '-email -_id -__v')
      .select({ '__v': false })
      .then(updatedTweet => {
        console.log('UPDATE FOOL', updatedTweet);
        res.send(updatedTweet);
      })
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .populate('handle')
      .then(listOfTweets => {
        res.send(listOfTweets);
      })
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Tweet
      .findById(req.params.id)
      .populate('handle')
      .then(foundTweet => {
        res.send(foundTweet);
      })
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Tweet.findByIdAndDelete(req.params.id)
      .then(() => {
        res.send({ deleted: 1 });
      })
      .catch(next);
  });  
