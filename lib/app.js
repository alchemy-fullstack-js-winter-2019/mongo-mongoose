const express = require('express');
const app = express();
const connection = require('./middleware/connection');
const tweets = require('./routes/tweets');
const notFound = require('./middleware/notFound');
const { handler } = require('./middleware/error');
const users = require('./routes/users');
const auth = require('./routes/auth');

app.use(express.json());
app.use('/tweets', connection, tweets);
app.use('/users', connection, users);
app.use('/auth', connection, auth);

app.use(notFound);
app.use(handler);

app.use(require('morgan')('dev', {
  skip() {
    return process.env.NODE_ENV === 'test';
  }
}));

module.exports = app;
