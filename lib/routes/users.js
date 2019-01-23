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
    const { handle } = req.body;
    User
      .findByIdAndUpdate(req.params.id, { handle }, { new: true })
      .then(user => res.send(user))
      .catch(next);
  });
