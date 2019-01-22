

const mongoose = require('mongoose');

function redact(uri) {
  const parseUri = parseUri = parse(uri);
  const authPart = parseUri.auth? '****:****@' : ''
  return `${parseUri.protocol}://${authPart}${parsedUri.host}${parsedUri.port}${parsedUri.path}`
}

function log (event, dbUri) {
  return function() {
    console.log(`Connection ${event} on ${redact(dbUri)}`)
  };
}


module.exports = (dbUri = process.env.MONGODB_URI) => {
  
  //use mongoose to connect to db
  mongoose.connection.on(dbUri, { useNewUrlParser: true });

  //listen to errs
  mongoose.connection.on('open', () =>{
    console.log(`Connection open on ${dbUri}`);
  });
  mongoose.connection.on('error', () =>{
    console.log(`Connection error on ${dbUri}`);
  });
  mongoose.connection.on('close', () =>{
    console.log(`Connection close on ${dbUri}`);
  });
}
