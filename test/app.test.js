require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');

const createTweet = (handle) => {
  return request(app)
    .post('/tweets')
    .send({
      handle,
      text: 'my first tweet'
    })
    .then(res => res.body);
};

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  it('returns a list of tweets', () => {
    return Promise.all(['ryan', 'tyler', 'jack'].map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body.length).toEqual(3);
      });
  });
  it('posts a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'ryan',
        text: 'hello tweets'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'ryan',
          text: 'hello tweets',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
  it('finds a tweet by id', () => {
    return createTweet('tyler')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .get(`/tweets/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: 'tyler',
              text: 'my first tweet',
              _id,
              __v: 0
            });
          });
      });
  });
  it('updates an existing tweet by id', () => {
    return createTweet('tyler')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .put(`/tweets/${_id}`)
          .send({
            handle: 'tyler',
            text: 'This tweet is updated',
            _id,
            __v: 0
          })
          .then(res => {
            expect(res.body).toEqual({
              handle: 'tyler',
              text: 'This tweet is updated',
              _id,
              __v: 0
            });
          });
      });
  });
});
