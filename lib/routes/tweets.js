
const Tweet = require('../../lib/models/Tweet');
const { Router } = require('express');
const { HttpError } = require('../../lib/middleware/error');

const patcher = (body, fields) => {
  return Object.keys(body)
    .reduce((acc, key) => {
      if(fields.includes(key) && body[key]) {
        acc[key] = body[key];
      }
      return acc;
    }, {});
};


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
      .populate('handle', 'query.select({_id, handle, text, tags}')
      .then(foundTweet => {
        if(!foundTweet) {
          return next(new HttpError(404, `No Tweet found with ${_id}`));
        }
        res.send(foundTweet);
      })
      .catch(next);
  })
  
  
  .patch('/:id', (req, res, next) => {
    const patched = patcher(req.body, ['handle', 'text']);
    Tweet.findByIdAndUpdate(req.params.id, patched, 
      { new: true })
      .populate('handle', 'query.select({_id, handle, text, tags}')
      .then(tweet => res.send(tweet))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Tweet.findByIdAndDelete(req.params._id)
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });
 

