const express = require('express');
const app = express();
const tweets = require('./routes/tweets');
const connection = require('./middleware/connection');
const users = require('./routes/users');
const notFound = require('./middleware/notFound');
const { handler } = require('./middleware/error');

app.use(express.json());
app.use('/tweets', connection, tweets);
app.use('/users', users);

app.use(notFound);

app.use(handler);

module.exports = app;
