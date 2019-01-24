const { Router } = require('express');
const User = require('../models/User');
const { HttpError } = require('../middleware/error');

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
    const id = req.params.id;
    User
      .findById(id)
      .then(user => {
        if(!user) {
          return next(new HttpError(404, `No user found with that ${id}`));
        }
        res.send(user);
      })
      .catch(next);
  });

