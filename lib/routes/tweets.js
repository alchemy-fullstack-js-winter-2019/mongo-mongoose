const { Router } = require('express');
const Tweet = require('../models/Tweet');
const { HttpError } = require('../middleware/error');

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
//create a tweet
  .post('/', (req, res, next) => {
    const { handle, text } = req.body;
    Tweet
      .create({ handle, text })
      .then(tweet => res.send(tweet))
      .catch(next);
  })
//finds all the tweets
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .populate('handle')
      .then(tweets => res.send(tweets))
      .catch(next);
  
  })


//get tweet by id
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet
      .findById(_id)
      .populate('handle')
      .then(foundTweet => {
        if(!foundTweet) {
          return next(new HttpError(404, `Nothing was found with that ${_id}`));
        }
        res.send(foundTweet);
      })
      .catch(next);
  })
//find by id and update
  .patch('/:id', (req, res, next) => {
    const patched = patcher(req.body, ['handle', 'text']);
    Tweet
      .findByIdAndUpdate(
        req.params.id, 
        patched, 
        { new:true }
      )
      .populate('handle')
      .then(updatedTweet => res.send(updatedTweet)
      )
      .catch(next);
  })
//find by Id and delete
  .delete('/:id', (req, res, next) => {
    Tweet
      .findByIdAndDelete(req.params.id)
      .then(() => {
        res.send({ deleted: 1 });
      }
      )
      .catch(next);
  });
