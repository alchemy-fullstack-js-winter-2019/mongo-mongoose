const mongoose = require('mongoose');
const state = require('mongoose/lib/connectionstate');
let message = 'Internal Server Error';

const connection = (req, res, next) => {
  req.send(mongoose.connection.readyState);
  if(readyState === state.connected || state.connecting) {
    next();
  } else if(err instanceof HttpError) {
    code = err.code;
    message = err.message;
    next(err);
  }

  res
    .status(code)
    .send({ error: message });
};

module.exports = {
  connection
};
