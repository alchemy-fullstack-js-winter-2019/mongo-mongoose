require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const request = require('supertest');


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

  it('creates a new tweet', () => {
    return request(app)
    .post('/tweets')
    .send({
      handle: 'abel',
      text: 'my first tweet'
    })
    .then(res => {
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        handle: 'abel',
        text: 'my first tweet',
        _id: expect.any(String),
        __v: expect.any(Number)
      });
    });
  });

  it('can find a tweet', () => {

  });

  it('can find a tweet by id', () => {

  });

  it('can find by id and update', () => {

  });

  it('can find by id and delete', () => {

  });