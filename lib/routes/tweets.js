/* eslint-disable no-console*/
const Tweet = require('../models/Tweet');
const { Router } = require('express');
const ronSwanson = require('../middleware/ronSwanson');

// const patcher = { body, fields } => {
//   return Object.keys(body)
//   .reduce((acc, key) => {
//     if(fields.includes(key) && body[key]) {
//       acc[key] = body[key];
//     }
//     return acc;
//   }, {});
// };

module.exports = Router()

  .post('/', ronSwanson, (req, res, next) => {
    const { handle, text } = req.body;
    if(req.query.random) {
      Tweet
        .create({ handle, text: req.quote })
        .then(tweet => {
          res.send(tweet);
        })
        .catch(next);
    }
    Tweet
      .create({ 
        handle, 
        text
      })
      .then(createdTweet => res.send(createdTweet))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Tweet
      .findById(req.params.id)
      .select('-__v')
      .populate('handle', '-name -email -_id -__v')
      .then(foundTweet => {
        res.send(foundTweet);
      })
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    // const patched = patcher(req.body, ['handle', 'text']);
    Tweet
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .select('-__v')
      .populate('handle', '-name -email -_id -__v')
      .then(updatedTweet => {
        res.send(updatedTweet);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Tweet
      .find()
      .select('-__v')
      .populate('handle', '-name -email -_id -__v')
      .then(tweets => res.send(tweets))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Tweet
      .findByIdAndDelete(req.params._id)
      .populate('handle')
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });




