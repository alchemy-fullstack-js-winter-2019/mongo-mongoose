/* eslint-disable no-console*/

const express = require('express');
const app = express();
const tweets = require('./routes/tweets');
// const tags = require('./routes/tags');
// const notFound = require('./middleware/notFound');
// const { handler } = require('./middleware/error');

// Morgan example
// app.request(require('morgan')('dev'), () => {

// });

app.use((req, res, next) => {
    req.startAt = Date.now();
    const path = req.url;
    res.on('finish', () => {
        const responseTime = Date.now() - req.startAt;
        console.log(`${req.method} '${path}' [${res.statusCode}] - ${responseTime}ms`);
    });
    next();
});

app.use(express.json());
app.use('/tweets', tweets);
// app.use('/tags', tags);
// app.use(notFound);
// app.use(handler);

module.exports = app;
