require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');
const Tweet = require('../lib/models/Tweet');

const createTweet = (handle) => {
  return request(app)
    .post('/tweets')
    .send({
      handle: handle,
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
      .then(createdTweets => {
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
    createTweet('tyler')
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
});
