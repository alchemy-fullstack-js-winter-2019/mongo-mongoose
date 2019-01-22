
const express = require('express');
const app = express();





app.use(express.json());


app.use(notFound);




module.exports = app;
