const mongoose = require('mongoose');
const state = require('mongoose/lib/connectionstate');

module.exports = (req, res, next) => {
  const readyState = mongoose.connection.readyState
  if(readyState === state.connected || readyState ===)
    next();
} else {
  next(new HttpError(500, 'Cannot connect'))
  
  }
};
