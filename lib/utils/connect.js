const mongoose = require('mongoose');

function log(event, dbUri) {
    return function() {
        console.log(`Connection ${event} on ${dbUri}`);
    };
}
  
module.exports = (dbUri = process.env.MONGODB_URI) => {
    // use mongoose.connect to connect to db
    mongoose.connect(dbUri, { useNewUrlParser: true });
  
    mongoose.connection.on('open', log('open', dbUri));
  
    mongoose.connection.on('error', log('error', dbUri));
  
    mongoose.connection.on('close', log('close', dbUri));
};