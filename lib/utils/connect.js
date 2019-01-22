const { parse } = require('url');
const mongoose = require('mongoose');

function redact(uri) {
  const parsedUri = parse(uri);
  const authPart = parsedUri.auth ? '*****:****' : '';
  return `${parsedUri.protocol}://${authPart}${parsedUri.host}:${parsedUri.port}${parsedUri.path}`;
}

function log(event, dbUri) {
  return function() {
    console.log(`Connection ${event} on: ${redact(dbUri)}`);
  };
}

module.exports = (dbUri = process.env.MONGODB_URI) => {
  mongoose.connect(dbUri, { useNewUrlParser: true });
  
  mongoose.connection.on(log('open', dbUri));

  mongoose.connection.on(log('error', dbUri));

  mongoose.connection.on(log('close', dbUri));
};
