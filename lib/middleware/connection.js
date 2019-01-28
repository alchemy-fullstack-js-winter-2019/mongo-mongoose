const { HttpError } = require('../middleware/error');
const state = require('mongoose/lib/connectionstate');

module.exports = (req, res, next) => {
  if(state === state.connected || state === state.connecting) {
    next();
  } 
  else {
    next(new HttpError(500, 'Cannot connect'));
  }
};
