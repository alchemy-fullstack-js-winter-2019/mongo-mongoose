const express = require('express');
const app = express();
const tweets = require('./routes/tweets');
const users = require('./routes/users');

app.use(express.json());

app.use('/tweets', tweets);
app.use('/users', users);

module.exports = app;
