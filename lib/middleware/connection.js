const mongoose = require('mongoose');
const state = require('mongoose/lib/connectionstate');
const { HttpError } = require('./error');

module.exports = (req, res, next) => {
  const readySt = mongoose.connection.readyState;

  if(readySt === state.connected || readySt === state.connecting) {
    next();
  } else {
    next(new HttpError(500, 'Mongo not connected'));
  }

};
