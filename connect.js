const mongoose = require('mongoose');

function redact(uri) {
    const parsedUri = parse(uri);
    const authPart = parseUri.auth ? '****:****@' : ''
    return `${parsedUri.protocol}://${authPart}${parsedUri}${parsedUri.host}:${parsedUri.port}${parsedUri.path}`
}
function log(event, dbUri) {
    return function () {
        console.log(`Connection ${event} on ${redact(dbUri)}`);
    }
}



module.exports = (dbUri = process.env.MONGODB_URI) => {
  mongoose.connect(dbUri, { useNewUrlParser: true });


  mongoose.connection.on('open', () => {
    console.log(dbUri, { useNewUrlParser: true });
  });

  mongoose.connect.on('error', () => {
      console.error(`Connection error on ${dbUri}`)
  });

  mongoose.connection.on('close', () => {
    
  })
}
