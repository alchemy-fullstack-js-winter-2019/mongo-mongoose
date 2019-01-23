const Router = require('express').Router;
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
      .then(users => res.send(users))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    User
      .findById(_id)
      .then(user => res.send(user))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    const _id = req.params.id;
    const { name, email } = req.body;
    User
      .findByIdAndUpdate(_id, { name, email }, { new: true })
      .then(updatedUser => res.send(updatedUser))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    const _id = req.params.id;
    User
      .findByIdAndDelete(_id)
      .then(() => res.send({ deleted : 1 }))
      .catch(next);
  });
