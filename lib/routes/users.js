const Router = require('express').Router;
const User = require('../models/User');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, name, email } = req.body;
    User
      .create({ handle, name, email })
      .then(User => res.send(User))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    const id = req.params.id;
    User
      .findById(id)
      .then(foundUser => res.send(foundUser))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    User
      .find()
      .then(Users => res.send(Users))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    const id = req.params.id;
    User
      .findByIdAndUpdate(id, req.body, { new: true })
      .then(updatedUser => res.send(updatedUser))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    const id = req.params.id;
    User
      .findByIdAndDelete(id)
      .then(deleted => res.send(deleted))
      .catch(next);
  });
  



