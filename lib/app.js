const express = require('express');
const app = express();
const tweets = require('./routes/tweet');
const users = require('./routes/user');
// const people = require('./routes/people');
// const notFound = require('./middleware/notFound');
// const { handler } = require('./middleware/error');


app.use((req, res, next) => {
    req.startAt = Date.now();
    const responseTime = Date.now() - req.startAt;
    /* eslint-disable-next-line */
  console.log('Request Incoming!',
        req.method, req.url, [res.statusCode], responseTime);
    next();
});

app.use(express.json());
app.use('/tweets', tweets);
app.use('/users', users);

// app.use(notFound);
// app.use(handler);

module.exports = app;
