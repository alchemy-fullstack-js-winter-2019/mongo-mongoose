const User = require('../models/User');
const { Router } = require('express');

module.exports = Router()

  .post('/', (req, res, next) => {
    const { handle, name, email } = req.body;
    User
      .create({
        handle,
        name,
        email
      })
      .then(createdUser => res.send(createdUser))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    User
      .findById(req.params.id)
      .then(foundUser => res.send(foundUser))
      .catch(next);
  });


