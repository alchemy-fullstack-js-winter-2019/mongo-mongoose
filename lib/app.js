const express = require('express');
const app = express();
const tweets = require('./router/tweets');
const users = require('./router/users');
const notFound = require('./middleware/notFound');
const { handler } = require('./middleware/error');
const connection = require('./middleware/connect');


app.use(express.json());

app.use('/tweets', connection, tweets);
app.use('/users', connection, users);

app.use(notFound);

app.use(handler);


module.exports = app;
