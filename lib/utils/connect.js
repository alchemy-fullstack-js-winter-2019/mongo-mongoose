const { parse } = require('url');
const mongoose = require('mongoose');

function redact(uri) {
  const parsedUri = parse(uri);
  const authPart = parsedUri.auth ? '****:****@' : ''
  return `${parsedUri.protocol}://${authPart}${parsedUri.host}:${parsedUri.port}${parsedUri.path}`
}

function log(event, dbUri) {
  return function () {
    console.log(`Connection ${event} on ${redact(dbUri)}`);
  }
}

module.exports = (dbUri = process.env.MONGODB_URI) => {
  // use mongoose.connect to connect to db

  mongoose.connect(dbUri, { useNewUrlParser: true });

  mongoose.connection.on('open', () => {
    console.log(`Connection open on ${dbUri}`);
  });

  mongoose.connection.on('error', () => {
    console.log(`Connection error on ${dbUri}`);
  });

  mongoose.connection.on('close', () => {
    console.log(`Connection close on ${dbUri}`);
  });
}