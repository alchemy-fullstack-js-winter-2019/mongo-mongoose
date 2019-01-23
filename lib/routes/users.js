const { Router } = require('express');
const User = require('../models/User');



module.exports = Router()
  //create a user
  .post('/', (req, res, next) => {
    const { handle, text } = req.body;
    User
      .create({ handle, text })
      .then(user => res.send(user))
      .catch(next);
  })
  //finds all the users
  .get('/', (req, res, next) => {
    User
      .find()
      .then(users => res.send(users))
      .catch(next);
  })
  //get user by id
  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    User
      .findById(_id)
      .then(foundUser => {
        if (!foundUser) {
          return next(new HttpError(404, `Nothing was found with that ${_id}`))
        }
        res.send(foundUser)
      })
      .catch(next);
  })
  //find by id and update
  .patch('/:id', (req, res, next) => {
    User
      .findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )
      .then(updatedUser => res.send(updatedUser)
      )
      .catch(next);
  })
  //find by Id and delete
  .delete('/:id', (req, res, next) => {
    User
      .findByIdAndDelete(req.params.id)
      .then(() => {
        res.send({ deleted: 1 })
      }
      )
      .catch(next);
  })
