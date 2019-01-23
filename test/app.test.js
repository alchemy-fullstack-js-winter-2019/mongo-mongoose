require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');

const createUser = (handle, name, email) => {
  return User.create({ handle, name, email })
    .then(user => ({ ...user, _id: user._id.toString() }));
};
const createTweet = (handle, text = 'a tweet') => {
  return createUser(handle, 'ryan', 'ryan@email.com')
    .then(user => {
      return Tweet.create({ handle: user._id, text })
        .then(tweet => ({ ...tweet, _id: tweet._id.toString() }));
    });
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
    return createUser('tyler', 'Tyler Corbett', 'tyler@gmail.com')
      .then(user => {
        return request(app)
          .post('/tweets')
          .send({
            handle: user._id,
            text: 'hello tweets'
          })
          .then(res => {
            expect(res.body).toEqual({
              handle: expect.any(String),
              text: 'hello tweets',
              _id: expect.any(String),
              __v: 0
            });
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
              _id,
              handle: expect.any(Object),
              text: 'a tweet'
            });
          });
      });
  });
  it('updates an existing tweet by id', () => {
    return createTweet('tyler')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .patch(`/tweets/${_id}`)
          .send({
            text: 'This tweet is updated'
          })
          .then(res => {
            expect(res.body).toEqual({
              _id,
              handle: expect.any(Object),
              text: 'This tweet is updated'
            });
          });
      });
  });
  it('deletes a tweet by id', () => {
    return createTweet('tyler')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .delete(`/tweets/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              _id,
              handle: expect.any(Object),
              text: 'a tweet',
            });
          });
      });
  });
});

