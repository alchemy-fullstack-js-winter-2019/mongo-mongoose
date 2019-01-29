const { Router } = require('express');
const Users = require('../models/Users');
const { HttpError } = require('../middleware/error');

module.exports = Router()
  .post('/', (req, res, next)=>{
    const { handle, name, email } = req.body;
    Users
      .create({ handle, name, email })
      .then(user => res.send(user))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Users
      .find()
      .then(users => res.send(users))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    const _id = req.params.id;
    Users
      .findByIdAndUpdate(_id, req.body, { new: true })
      .then(updatedUser => {
        res.send(updatedUser);
      })
      .catch(next); 
  })
  .delete('/:id', (req, res, next) => {
    const _id = req.params.id;
    Users
      .findByIdAndDelete(_id)
      .then(() => {
        res.send({ deleted: 1 });
      })
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    Users
      .findById(_id)
      .then(foundUser => {
        if(!foundUser) {
          return next(new HttpError(404, `No Tweet found with ${_id}`));
        }
        res.send(foundUser);
      })
      .catch(next);
  });


