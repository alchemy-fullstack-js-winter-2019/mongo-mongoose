const express = require('express');
const app = express();
const tweets = require('./routes/tweets');

pp.use(express.json());
app.use('/tweets', tweets);

module.exports = app;