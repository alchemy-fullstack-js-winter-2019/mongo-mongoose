const { Router } = require('express');
const Tweet = require('../models/Tweet');
const { HttpError } = require('../middleware/error');

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
      .populate('handle', { handle: true })
      .select({ __v: false })
      .then(tweets => res.send(tweets))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    const id = req.params.id;
    Tweet
      .findById(id)
      .populate('handle', '-id -__v -name -email')
      .then(tweet => {
        if(!tweet) {
          return next(new HttpError(404, `No Tweet Found with ${id}`));
        }
        res.send(tweet);
      })    
      .catch(next); 
  })

  .patch('/:id', (req, res, next)  => {
    const id = req.params.id;
    Tweet
      .findByIdAndUpdate(id, req.body, { new: true })
      .populate('handle', '-id -__v -name -email')
      .then(tweet => {
        res.send(tweet);
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
  });
  





 
