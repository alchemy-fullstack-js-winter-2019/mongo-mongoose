const mongoose = require('mongoose');
const state = require('mongoose/lib/connectionstate');
const { HttpError } = require('./error');

module.exports = (req, res, next) => {
  const readySt = state;
  // get the current mongoose.connection.readyState from mongoose
  console.log('readSt is:', mongoose.connection.readyState);
  // if the readyState is state.connected or state.connecting
  if(readySt === 1 || readySt === 2) {
    // invoke next, there is no issue
    next();
  }
  // otherwise 
  // create a new HttpError with code 500 and message "Mongo not connected"
  // invoke next with the error
  else {
    new HttpError(500, 'Mongo not connected');
    next();
  }

};
