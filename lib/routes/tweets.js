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
    Tweet.find()
      .then(tweets => res.send(tweets))
      .catch(next);
  })
  
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet.findById(_id) 
      .then(foundTweet => res.send(foundTweet))
      .catch(next);
  })
  
  .patch('/:id', (req, res, next) => {
    const { handle, text } = req.body;
    Tweet.findByIdAndUpdate(req.params.id, { handle, text })
      .then(updatedTweet => res.send(updatedTweet))
      .catch(next);
  })
  

  .delete('/:id', (req, res, next) => {
    Tweet.findByIdAndDelete(req.params.id)
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });
