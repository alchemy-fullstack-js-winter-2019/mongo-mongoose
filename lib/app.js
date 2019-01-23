const express = require ('express');
const app = express();
const tweets = require('./routes/tweets');

app.use(express.json()); //applies the boby parsing middleware to all routes
app.use('/tweets', tweets);

module.exports = app;
