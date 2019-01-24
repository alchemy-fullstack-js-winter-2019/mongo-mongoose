const state = require('mongoose/lib/connectionstate');
const { HttpError } = require('./error');


module.exports = (req, res, next) => {
  if(state === state.connected || state.connecting) {
    next();
  } else {
    const err = new HttpError(500, 'Mongo not connected');
    next(err);
  }
};
