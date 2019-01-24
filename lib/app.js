/* eslint-disable no-console */
const express = require('express');
const app = express();
const tweets = require('./routes/tweets');
const users = require('./routes/users');
const connection = require('./middleware/connection');

app.use(express.json());

app.use(connection);
app.use('/tweets', tweets);
app.use('/users', users);


module.exports = app;
