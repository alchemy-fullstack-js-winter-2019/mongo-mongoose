require('dotenv').config();
require('./connect')();

const app = require('./lib/app');

app.listen(7890, () => {
  console.log('running');
});
