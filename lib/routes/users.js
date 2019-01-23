const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, name, email } = req.body;
    User
      .create({
        handle,
        name,
        email
      }).then(user => res.send(user))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    User
      .find()
      .populate('handle')
      .then(users => res.send(users))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    User
      .findById(req.params.id)
      .then(user => res.send(user))
      .catch(next);
  })
  .patch('/:id', (req, res, next)=> {
    const { name, email } = req.body;
    User
      .findOneAndUpdate(req.params.id, { name, email }, { new: true })
      .then(user => res.send(user))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    User
      .findByIdAndDelete(req.params.id)
      .then(deleted => res.send(deleted))
      .catch(next);
  });
