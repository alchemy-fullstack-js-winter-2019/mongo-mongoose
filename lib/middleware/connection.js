const mongoose = require('mongoose');
const state = require('mongoose/lib/connectionstate');
const { HttpError } = require('./error');

module.exports = (req, res, next) => {
  const readyState = mongoose.connection.readyState;
  if(readyState === state.connected || readyState === state.connecting){
    next();
  }
  else {
    const err = new HttpError(500, 'Mongo not connected');
    next(err);
  }
};
