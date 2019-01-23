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
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .then(tweets => res.send(tweets))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet
      .findById(_id)
      .then(tweet => res.send(tweet))
      .catch(next);
  })
  // .patch('/:id', (req, res, next) => {
  //   const _id = req.params.id;
  //   const { handle, text } = req.body;
  //   Tweet
  //     .findByIdAndUpdate(_id, { handle, text }, { new: true })
  //     .then(updatedTweet => res.send(updatedTweet))
  //     .catch(next);
  // })
  .patch('/:id', (req, res) => {
    const _id = req.params.id;
    const { handle, text } = req.body;
    Tweet.findByIdAndUpdate(_id, {
      handle,
      text
    }, (err, updatedTweet) => {
      if(req.body._id){
        delete req.body._id;
      }
      for(let t in req.body) {
        updatedTweet[t] = req.body[t];
      }
      updatedTweet.save();
      res.send(updatedTweet);
    });
  })
  .delete('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet
      .findByIdAndDelete(_id)
      .then(() => res.send({ deleted : 1 }))
      .catch(next);
  });


