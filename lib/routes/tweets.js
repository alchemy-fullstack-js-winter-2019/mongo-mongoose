/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const Tweets = require('../../lib/routes/tweets');
const { Router } = require('express');
const { HttpError } = require('../../lib/middleware/error');

module.exports = Router() 
  .post('/', (req, res, next) => {
    console.log('post', post);
    const { handle, text } = req.body;
    Tweets.create({ handle, text })
      .then(tweet => {
        
        return res.send(tweet))
      
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Tweets.find()
      .then(tweets => res.send(tweets))
      .catch(next);
  })
    
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweets.findById(_id)
      .then(foundTweet => {
        if(!foundTweet) {
          return next(new HttpError(404, `No Tweet found with ${_id}`));
        }
        res.send(foundTweet);
      })
      .catch(next);
  })
  
  
  .put('/:id', (req, res) => {
    const { handle, text } = req.body;
    Tweets.findByIdAndUpdate(req.params.id,
      { handle, text },
      (err, updated) => res.send(updated));
  })
  .delete('/:id', (req, res) => {
    Tweets.findByIdAndDelete(req.params._id, (err, data) => {
      if(err) return next(err);
      res.send(data);
    });
  });

