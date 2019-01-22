const mongoose = require('mongoose');

module.exports = (dbUri = process.env.MONGODB_URI) => {
  mongoose.connect(dbUri, { useNewUrlParser: true });
  
  mongoose.connection.on('error', err => {
    console.log(err);
  });
  
  mongoose.connection.on('open', () => {
    console.log('connection is opened at ', dbUri);
  });

  mongoose.connection.on('close', () => {
    console.log('connection is closed');
  });
};
