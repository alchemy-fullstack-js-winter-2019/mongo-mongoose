const mongoose = require('mongoose');
const { HttpError } = require('./error');

module.exports = (req, res, next) => {
  const state = mongoose.connection.readyState;

  if(state === 1 || state === 2) {
    next();
  } else {
    return next(new HttpError(500, 'Not connected'));
  }
};
