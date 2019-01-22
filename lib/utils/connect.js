const mongoose = require('mongoose');
const { parse } = require('url');

// Redacting the uri (aka url) takes the username and password out of the uri
function redact(uri) {
    const parsedUri = parse(uri);
    const authPart = parsedUri.auth ? '****:****@' : '';
    return `${parsedUri.protocol}://${authPart}${parsedUri.host}:${parsedUri.port}${parsedUri.path}`; 
}

// log function logs the console so that you don't have to repeat - don't forget to include the redact function for the dbUri
function log(event, dbUri) {
    return function() {
        console.log(`Connection ${event} on ${redact(dbUri)}`);
    };
}

module.exports = (dbUri = process.env.MONGODB.URI) => {
    mongoose.connect(dbUri, { useNewUrlParser: true });

    mongoose.connection.on('error', () => {
        console.log(`Error on ${dbUri}`);
    });

    mongoose.conection.on('open', () => {
        console.log(`Connection open on ${dbUri}`);
    });

    mongoose.connection.on('close', () => {
        console.log(`Connection closed on ${dbUri}`);
    });

};
