require('dotenv').config();
require('./lib/utils/connect')();

const app = require('./lib/app');

const PORT = 7890 || process.env.PORT;





app.listen(7890, () => console.log(`Listening on ${PORT}`));