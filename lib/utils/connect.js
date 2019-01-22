const mongoose = require('mongoose');

function connect(dbUri = process.env.MONGODB_URI) {
  mongoose.connect(dbUri, { useNewUrlParser: true });
  mongoose.connection.on('open', () => {
    console.log(`Mongoose opened at on: ${dbUri}`);
  });
  mongoose.connection.on('close', () => {
    console.log(`Connection closed: ${dbUri}`);
  });
  mongoose.connection.on('error', () => {
    console.log(`Error with connection ${dbUri}`);
  });

}

module.exports = connect;
