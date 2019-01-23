const express = require('express');
const app = express();
const tweets = require('./routes/tweets');
const users = require('./routes/users');
const notFound = require('./middleware/notFound');
const { handler } = require('./middleware/error');

app.use(express.json());
app.use('/tweets', tweets);
app.use('/users', users);
app.use(notFound);
app.use(handler);

module.exports = app;
