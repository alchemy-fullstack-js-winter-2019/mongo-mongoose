const state = require('mongoose/lib/connection/state');
const { HttpError } = require('../middleware/error');

module.exports = (req, res, next) => {
  if(state === state.connected  || state === state.connecting) {
    next();
  }
  else {
    next(new HttpError(500, 'Not connected to MongoDB'));
  }
};

