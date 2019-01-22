const mongoose = require('mongoose');


module.exports = (dbUri = process.env.MONGODB_URI) => {
mongoose.connect(dbUri, { useNewUrlParser: true })

mongoose.connection('open', () => console.log('OPENED CONNECTION', dbUri));

mongoose.connection('error', () => console.log(error, dbUri));

mongoose.connection('close', () => console.log('CLOSED CONNECTION', dbUri))
}