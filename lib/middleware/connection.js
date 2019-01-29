const mongoose = require('mongoose');
const state = require('mongoose/lib/connectionstate');
const HttpError = require('./error');

module.exports = (req, res, next) => {
  let readyState = mongoose.connection.readyState;
  if(readyState === state.connected || state.connecting) {
    next();
  } else {
    const httpError = new HttpError(500, 'Mongo not connected');
    next(httpError);
  }
};
