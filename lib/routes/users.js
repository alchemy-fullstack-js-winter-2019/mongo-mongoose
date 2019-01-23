const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()

  .post('/', (req, res, next) => {
    const { handle, name, email } = req.body;
    User
      .create({ handle, name, email })
      .then(user => res.send(user))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    User
      .find()
      .then(foundTweet => res.send(foundTweet))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    User
      .findById(_id)
      .then(foundUser => res.send(foundUser))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    const id = req.params.id;
    User
      .findByIdAndUpdate(id, req.body, { new: true })
      .then(updatedUser => {
        res.send(updatedUser);
      })
      .catch(next);
  });
