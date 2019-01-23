const express = require('express');
const tweets = require('./routes/tweets');
const app = express();
const { handler } = require('../lib/middleware/error');
const notFound = require('./middleware/notFound');

app.use(require('morgan')('dev', {
    skip() {
        return process.env.NODE_ENV === 'test';
    }
}));

app.use(express.json());
app.use('/tweets', tweets);
app.use(notFound);
app.use(handler);





module.exports = app;