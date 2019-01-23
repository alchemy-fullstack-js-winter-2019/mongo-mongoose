const { Router } = require('express');
const Tweet = require('../models/Tweet');



module.exports = Router()

  .post('/', (req, res, next) => {
    // console.log('Dis you get a', req.body);
    const { handle, text } = req.body;
    Tweet.create({
      handle,
      text
    }, (err, createdTweet) => {
      if(err) return next (err);
      res.send(createdTweet);
      // console.log('Whats up', createdTweet);
    });
  })
  .get('/', (req, res, next) => {
    Tweet.find((err, listOfTweets) => {
      if(err) return next (err);
      res.send(listOfTweets);
    });
  })
  .get('/:id', (req, res, next) => {
    console.log('Got here', req.params);
    Tweet.findById(req.params.id, (err, getTweetById) => {
      if(err) {
        if(err.code === 'ENOENT') {
          return next (new HttpError(400, `Bad Id: ${req.params.id}`));
        } else {
          return next (err);
        }
      }
      res.send(getTweetById);
    });
  })
  .put('/:id', (req, res, next) => {
    const _id = req.params.id;
    const { handle, text } = req.body;
    Tweet.findByIdAndUpdate(_id, {
      handle,
      text
    }, (err, fixTweet) => {
      if(err) return next (err);
      res.send(fixTweet);
    });
  })
  .delete('/:id', (req, res, next) => {
    Tweet.findByIdAndDelete(req.params.id, (err, deleteTweet) => {
      if(err) return next (err);
      res.send(deleteTweet);
    });
  });
