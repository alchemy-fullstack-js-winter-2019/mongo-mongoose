const express = require('express');
const app = express();
const users = require('../lib/routes/user');
const tweets = require('../lib/routes/tweet');
const notFound = require('../lib/middleware/notFound');
const connection = require('../lib/middleware/connection');
const { handler } = require('../lib/middleware/error');


app.use(require('morgan')('dev', {
    skip() {
        return process.env.NODE_ENV === 'test';
    }
}));


app.use(express.json());
app.use('/tweets', connection, tweets);
app.use('/users', users);

app.use(notFound);
app.use(handler);

module.exports = app;
