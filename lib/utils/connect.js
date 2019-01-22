const mongoose = require('mongoose');

module.exports = dbUrl => {
  dbUrl = process.env.MONGODB_URI;
  mongoose.connect(dbUrl);
  
  mongoose.on('error', err => {
    console.log(err);
  });
  
  mongoose.on('open', () => {
    console.log('connection is opened at ', dbUrl);
  });

  mongoose.on('close', () => {
    console.log('connection is closed');
  });
};
