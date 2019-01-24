const { HttpError }  = require('./error');
const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  const state = mongoose.connection.readyState;
  if(state === 1 || state === 2) {
    next();
  }
  else {
    return next(new HttpError(500, 'Mongo not connected'));
  }
};

