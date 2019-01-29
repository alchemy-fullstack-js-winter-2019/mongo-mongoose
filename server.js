require('dotenv').config();
require('./lib/utils/connect')();

const app = require('./lib/app');

app.listen(7892, () => {
  console.log('running');
});
