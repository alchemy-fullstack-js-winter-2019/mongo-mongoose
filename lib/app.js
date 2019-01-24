const express = require('express');
const app = express();
const tweets = require('./router/tweets');
const users = require('./router/users');
const notFound = require('./middleware/notFound');
const { handler } = require('./middleware/error');
const connection = require('./middleWare/connect');

// app.use(require('morgan')('dev', {
//   skip() {
//     return process.env.NODE_ENV === 'test';
//   }
// }));

//explain for getting an posting 
app.use(express.json());

//is this the default url for methods?
app.use('/tweets', connection, tweets);
app.use('/users', connection, users);

//function in case a url is not found
app.use(notFound);

//
app.use(handler);


//another way to export?
module.exports = app;
