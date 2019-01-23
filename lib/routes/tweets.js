
const Tweet = require('../../lib/models/Tweet');
const { Router } = require('express');
const { HttpError } = require('../../lib/middleware/error');

module.exports = Router() 
  .post('/', (req, res, next) => {
    
    const { handle, text } = req.body;
    Tweet
      .create({ handle, text })
      .then(tweet => res.send(tweet))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Tweet.find()
      .then(tweets => res.send(tweets))
      .catch(next);
  })
    
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet.findById(_id)
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
    Tweet.findByIdAndUpdate(req.params.id,
      { handle, text },
      (err, updated) => res.send(updated));
  })
  .delete('/:id', (req, res, next) => {
    Tweet.findByIdAndDelete(req.params._id)
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });
 

