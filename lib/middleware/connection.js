const mongoose = require('mongoose');
const state = require('mongoose/lib/connectionstate');
const HttpError = require('../middleware/error');

module.exports = (req, res, next)  => {
  const readyState =  mongoose.connection.readyState;
  if(readyState === state.connected || readyState ===  state.connecting) {
    next();
  } else {
    next(new HttpError(500, 'MongoDB not connected'));
  }
};
