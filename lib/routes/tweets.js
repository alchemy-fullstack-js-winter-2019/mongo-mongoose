const { Router } = require('express');
const Tweet = require('../models/Tweet');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, text } = req.body;
    Tweet.create({
      handle, 
      text
    })
      .then(createdTweet => {
        res.send(createdTweet);
      }).catch(next);
  })

  .get('/', (req, res, next) => {
    Tweet.find((err, listOfTweets) => {
      if(err) return next(err);
      res.send(listOfTweets);
    });
  })
  
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet.findById(_id, (err, foundTweet) => {
      if(err) return next(err);
      res.send(foundTweet);
    });
  })

  .put('/:id', (req, res, next) => {
    const { handle, text } = req.body;
    Tweet.findByIdAndUpdate(req.params.id,
      { handle, text },
      (err, updated) => {
        if(err) return next(err);
        res.send(updated);
      });
  });
