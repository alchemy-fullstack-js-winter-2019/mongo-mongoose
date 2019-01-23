const { parse } = require('url');
const mongoose = require('mongoose');

function redact(uri) {
  const parseUri = parseUri = parse(uri);
  const authPart = parseUri.auth? '****:****@' : ''
  return `${parseUri.protocol}://${authPart}${parsedUri.hostname}${parsedUri.port}${parsedUri.path}`
}

function log (event, dbUri) {
  return function() {
    console.log(`Connection ${event} on ${redact(dbUri)}`);
  }
}


module.exports = (dbUri = process.env.MONGODB_URI) => {
  
  //use mongoose to connect to db
  mongoose.connection(dbUri, { useNewUrlParser: true });

  //listen to errs
  mongoose.connection.on('open', log('open', dbUri));

  mongoose.connection.on('error', log('error', dbUri));

  mongoose.connection.on('close', log('close', dbUri));
  };

