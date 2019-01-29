/* eslint-disable no-console*/

const express = require('express');
const app = express();
const tweets = require('./routes/tweets');
const users = require('./routes/users');
const notFound = require('./middleware/notFound');
const { handler } = require('./middleware/error');
const connection = require('./middleware/connection');

app.use(require('morgan')('dev', {
  skip() {
    return process.env.NODE_ENV === 'test';
  }
}));

app.use(express.json());

app.use('/tweets', connection, tweets);
app.use('/users', connection, users);

app.use(notFound);

app.use(handler);

module.exports = app;
