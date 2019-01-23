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

  it('finds a list of tweets', () => {
    return Promise.all(['abel', 'another handle'])
      .then(createdTweets => {
        return request(app)
          .get('/tweets')
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('can find a tweet by id', () => {
    return createTweet('abel')
      .then(createdTweet => {
        return request(app)
          .get(`/tweets/${createdTweet._id}`)
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'abel',
          text: 'my first tweet',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('errors when a bad id is sent', () => {
    return request(app)
    .get('/tweets/badId')
    .then(res => {
      expect(res.status).toEqual(500)
    });
  });

  it('can find by id and update', () => {

  });

  it('can find by id and delete', () => {

  });