const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, name, email } = req.body;
    User.create({
      handle, 
      name, 
      email
    })
      .then(createdUser => {
        res.send(createdUser);
      }).catch(next);
  })

  .get('/', (req, res, next) => {
    User.find()
      .then(users => res.send(users))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    User.findById(_id)
      .then(foundUser => res.send(foundUser))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    const { handle, name, email } = req.body;
    User.findByIdAndUpdate(req.params.id, { handle, name, email }, { new: true })
      .then(updatedUser => res.send(updatedUser))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    User.findByIdAndDelete(req.params.id)
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });
