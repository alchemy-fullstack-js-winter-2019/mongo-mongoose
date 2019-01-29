const express = require('express');
const app = express();
const tweets = require('./routes/tweets');
const users = require('./routes/users');
const connection = require('./middleware/connection');

app.use(express.json());
app.use('/tweets', connection, tweets);
app.use('/users', connection, users);

module.exports = app;
