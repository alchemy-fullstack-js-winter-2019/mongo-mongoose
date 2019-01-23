require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');


describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      mkdirp('./data/tweets', done);
      done();
      });
    });
    afterEach(done => {
      rimraf('./data/tweets/*', done);
      done();
    });
  });

  // start tests

  it('creates a tweet', () => {

  });

  it('can find a tweet', () => {

  });

  it('can find a tweet by id', () => {

  });

  it('can find by id and update', () => {

  });

  it('can find by id and delete', () => {

  });