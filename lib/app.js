const express = require('express');
const app = express();
const tweets = require('./routes/tweets');
const users = require('./routes/users');
const notFound = require('./middleware/notFound');
const { handler } = require('./middleware/error');
const connection = require('./middleware/connection');


app.use(express.json());

app.use(connection);

app.use('/tweets', tweets);
app.use('/users', users);

app.use(notFound);
app.use(handler);


module.exports = app;
