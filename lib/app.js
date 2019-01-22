require('dotenv').config();
require('./utils/connect')();
const express = require('express');
const Tweets = require('./routes/tweets');
const app = express();

app.use(express.json());
app.use('/tweets', Tweets);




module.exports = app;