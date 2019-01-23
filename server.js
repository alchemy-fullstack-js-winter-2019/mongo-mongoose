/* eslint-disable no-console */
/* eslint-disable eol-last */
require('dotenv').config();
require('./lib/utils/connect')();

const app = require('./lib/app');

app.listen(7890, () => {
  console.log('running');
});