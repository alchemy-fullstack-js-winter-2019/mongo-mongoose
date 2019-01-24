const { Router } = require('express');
const Tweet = require('../models/Tweet');
const { HttpError } = require('../middleware/error');

//this is for the patch method, where we would nomrmally passe in the properties and nullify the other previous one, not really patching. instead of just being a putter. 
const patcher = (body, fields) => {
  //go over the keys in body which are the params
  return Object.keys(body)
    .reduce((acc, key) => {
      if(fields.includes(key) && body[key]) {
        acc[key] = body[key];
      }
      return acc;
    }, {});
};



module.exports = Router()
  .post('/', (req, res, next)=>{
    //explay this line
    const { handle, text } = req.body;
    Tweet
      .create({ handle, text })
      .then(tweet => res.send(tweet))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Tweet
      .find()
      //populate 'joins' ids by user.
      .populate('handle')
      .then(tweets => res.send(tweets))
      .catch(next);
  })
  
  .patch('/:id', (req, res, next) => {
    const patched = patcher(req.body, ['handle', 'text']);
    const _id = req.params.id;
    //req.body is used for patching since it contains the new stuff that were updating
    Tweet
      .findByIdAndUpdate(_id, patched, { new: true })
      .populate('handle')

      .then(updatedTweet => {
        res.send(updatedTweet);
      })
      .catch(next); 
  })
  .delete('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet
      .findByIdAndDelete(_id)
      .then(() => {
        res.send({ deleted: 1 });
      })
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Tweet
      .findById(_id)
      .populate('handle')
      .then(foundTweet => {
        if(!foundTweet) {
          return next(new HttpError(404, `No Tweet found with ${_id}`));
        }
        res.send(foundTweet);
      })
      .catch(next);
  });

