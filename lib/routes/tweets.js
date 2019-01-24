const { Router } = require('express');
const Tweet = require('../models/Tweet');
// const { HttpError } = require('../middleware/error');


module.exports = Router()

  .post('/', (req, res, next) => { 
    const { handle, text } = req.body; //destructoring req.body to get the handle and text
    Tweet
      .create({ handle, text })
      .then(tweet => res.send(tweet))
      .catch(next); //this catches any errors 

  })
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .populate('handle', { handle: true })
      .select({ __v: false })
      .then(tweets => res.send(tweets))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet
      .findById(_id)
      .populate('handle', { handle: true })
      .select({ __v: false })
      .then(foundTweet => res.send(foundTweet))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    const id = req.params.id;
    Tweet
      .findByIdAndUpdate(id, req.body, { new: true })
      .populate('handle', { handle: true })
      .select({ __v: false })
      .then(updatedTweet => {
        res.send(updatedTweet);
      })
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Tweet
      .findByIdAndDelete(req.params.id)
      .then(() => {
        res.send({ deleted: 1 });
      })
      .catch(next);
  });

 
