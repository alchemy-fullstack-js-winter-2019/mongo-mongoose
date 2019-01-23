const express = require('express');
const tweets = require('./routes/tweets');
const app = express();
const { handler } = require('../lib/middleware/error');

app.use(express.json());
app.use('/tweets', tweets);

app.use(handler);





module.exports = app;