require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
})
