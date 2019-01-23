const state = require('mongoose/lib/connectionstate');
const handler = (err, req, res, next) => {

  const mongoose = require('mongoose');

  let code = 500;
  let message = 'Internal Server Error';
  
  if(err instanceof HttpError) {
    code = err.code; 
    message = err.message;
}

module.exports = (req, res, next) => {

};
