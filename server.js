require('dotenv').config();
require('./lib/utils/connect')();

const app = require('./lib/app');

app.listen(7890, () => {
  console.log('Listening on 7890'); //eslint-disable-line no-console
});