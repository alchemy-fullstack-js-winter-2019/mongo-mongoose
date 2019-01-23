const { Router } = require('express');
const User = require('../models/User');
// const { HttpError } = require('../middleware/error');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { handle, name, email } = req.body;
    User
      .create({ handle, name, email })
      .then(user => res.send(user))
      .catch(next);
  });
