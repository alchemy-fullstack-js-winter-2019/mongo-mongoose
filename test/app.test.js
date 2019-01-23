require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const request = require('supertest');
const mongoose = require('mongoose');

const createTweet = handle => {
  return request(app)
    .post('/tweets')
    .send({
      handle: handle,
      text: 'my tweeter tweets'
    })
    .then(res => res.body);
};

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('creates a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({ handle: 'TA', text: 'my first tweet' })
      .then(res => {
        expect(res.body).toEqual({ 
          handle: 'TA',
          text: 'my first tweet',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
  it('finds by id', () => {
    return createTweet('TT')
      .then(createdTweet => {
        const id = createdTweet._id;
        return request(app)
          .get(`/tweets/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'TT',
          text: 'my tweeter tweets',
          _id: expect.any(String),
          __v: 0
        });
      });
  });


});

