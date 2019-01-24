const mongoose = require('mongoose');
const state = require('mongoose/lib/connectionstate');
const { HttpError } = require('./error');


module.exports = (req, res, next) => {
  // const readyState = mongoose.connection.readyState;
  if(mongoose.connection.readyState === state.connected || mongoose.connection.readyState === state.connecting) {
    next();
  } else {
    next(new HttpError(500, 'Can not connect to MongoDB'));
  }
};