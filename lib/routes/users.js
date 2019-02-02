const User = require('../../lib/models/User');
const { Router } = require('express');
const { HttpError } = require('../../lib/middleware/error');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, name, email } = req.body;
    User
      .create({ handle, name, email })
      .then(user => res.send(user))
      .catch(next);
  })
  
  .get('/', (req, res, next) => {
    User.find()
      .then(users => res.send(users))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    const _id = req.params.id;
    User.findById(_id)
      .then(foundUser => {
        if(!foundUser) {
          return next(new HttpError(404, `No user found with ${_id}`));

        }
        res.send(foundUser);
      })
      .catch(next);
  })

  .put('/:id', (req, res) => {
    const { handle, name, email } = req.body;
    User.findByIdAndUpdate(req.params.id,
      { handle, name, email },
      (err, updated) => res.send(updated));
  })
  .delete('/:id', (req, res, next) => {
    User.findByIdAndDelete(req.params._id)
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });
