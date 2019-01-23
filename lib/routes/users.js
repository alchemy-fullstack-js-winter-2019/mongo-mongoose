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
  });
