const mongoose = require('mongoose');
const { parse } = require('url');

//because we dont want to log user info we come up with a function to redact. 
function redact(uri){
  const parsedUri = parse(uri);
  //the ? mark works as a tenarary and the : is an else
  const authPart = parsedUri.auth ? '****:****@' : '';
  return `${parsedUri.protocol}://${authPart}${parsedUri.host}:${parsedUri.port}${parsedUri.path}`;


}

//takes even and db uri and console logs connection event on db uri we can insert this into our connection as// look at notes for previoius code
function log(event, dbUri){
  return function(){
    // eslint-disable-next-line no-console
    console.log(`connection${event} on ${redact(dbUri)}`);
  };
}

module.exports = (dbUri = process.env.MONGODB_URI) => {
  // use mongoose.connect to connect to db
  mongoose.connect(dbUri, { useNewUrlParser: true });

  mongoose.connection.on('open', log('open', dbUri));

  mongoose.connection.on('error', log('error', dbUri));

  mongoose.connection.on('close', log('close', dbUri));
};
