const mongoose = require('mongoose');

module.exports = (dbUri = process.env.MONGODB_URI) => {

  
  mongoose.connection.on('open', () => {
    console.log(`Connection opened on ${dbUri}`);
  });

  mongoose.connection.on('error', () => {
    console.error(`Error occurred on ${dbUri}`);
  });

  mongoose.connection.on('close', () => {
    console.log(`Connection closed on ${dbUri}`);
  })
};
