/* eslint-disable no-console */
const express = require('express');
const app = express();
const tweets = require('./routes/tweets');
const users = require('./routes/users');
const connection = require('./middleware/connection');
const ronSwanson = require('./middleware/ronSwanson');
const notFound = require('./middleware/notFound');
const { handler } = require('./middleware/error');

app.use(require('morgan')('dev', {
  skip() {
    return process.env.NODE_ENV === 'test';
  }
}));

app.use(express.json());

app.use(connection);
app.use('/tweets', tweets);
app.use('/users', users);

app.get('/random', ronSwanson, (req, res) => {
  res.status(200).send(req.quote);
});

app.get('/', (req, res) => {
  res.status(200).send(
    'Welcome to Cari\'s amazing Mongo Half Stack App'
  );
});

app.use(notFound);
app.use(handler);

module.exports = app;
