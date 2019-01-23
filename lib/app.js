const express = require('express');
const app = express();
const tweets = require('./router/tweets');
const notFound = require('./middleware/notFound');
const { handler } = require('./middleware/error');

// app.use(require('morgan')('dev', {
//   skip() {
//     return process.env.NODE_ENV === 'test';
//   }
// }));

//explain for getting an posting 
app.use(express.json());

//is this the default url for methods?
app.use('/tweets', tweets);

//function in case a url is not found
app.use(notFound);

//
app.use(handler);


//another way to export?
module.exports = app;
