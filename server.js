const app = require('./lib/app');
require('dotenv').config();
require('./lib/utils/connect')();

app.listen(3000, () => {
    /* eslint-disable-next-line */
    console.log('listening on port 3000');
});