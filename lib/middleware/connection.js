const state = require('mongoose/lib/connection/state');
const { HttpError } = require('../middleware/error');

module.exports = (err, req, res, next) => {
  if(state === state.connected  || state === state.connecting) {
    next();
  }
  else if(err instanceof HttpError) {
    res.status(500).send('Mongo is not connected');
    next();
  }
};

