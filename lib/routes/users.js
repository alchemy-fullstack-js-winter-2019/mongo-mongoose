const { Router } = require('express');
const { HttpError } = require('../middleware/error');
const Users = require('../models/User');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, name, email } = req.body;
    Users
      .create({ handle, name, email })
      .then(user => {
        res.send(user);
      })
      .catch(err => {
        next(err);
      });
  })
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Users
      .findById(_id)
      .then(foundUser => {
        if(!foundUser) {
          return next(new HttpError(404, `No User found with id: ${_id}`));
        }
        res.send(foundUser);
      })
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Users
      .find()
      .then(users => res.send(users))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    Users.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedUser) => {
      if(err) return next(err);
      res.send(updatedUser);
    });
  })
  .delete('/:id', (req, res, next) => {
    Users.findByIdAndDelete(req.params.id, (err) => {
      if(err) return next(err);
      res.send({ deleted: 1 });
    });
  });
