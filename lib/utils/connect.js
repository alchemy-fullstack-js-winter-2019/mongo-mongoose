const mongoose = require('mongoose');

function redact(uri) {
  return uri;
}

module.exports = (dbUri = process.env.MONGODB_URI) => {
  // use mongoose.connect to connect db
  mongoose.connect(dbUri, { useNewUrlParser: true });

  mongoose.connection.on(`Connection open on ${dbUri}`, () => {
    console.log(dbUri);
  });

  mongoose.connection.on('error', () => {
    console.error(`Connection error on ${dbUri}`)
  });

  mongoose.connection.on('close', () => {
    console.log(`Connection closed on ${dbUri}`);
  })
}