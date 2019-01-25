require('dotenv').config();
require('./lib/utils/connect')();
const app = require('../lib/app');
const mongoose = require('mongoose');
const request = require('supertest');
const Tweet = require('../lib/models/Tweet');

describe('tweets app', () => {
  const createTweet = (handle, text = 'a tweet') => {
    return Tweet.create({ handle, text });
  };
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('can create a new tweet', () => {
    return request(app)
      .post('/tweets')
      .send({ 
        handle: 'ryan', 
        text: 'hello tweets' 
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'sophie',
          text: 'hello tweets',
          _id: expect.any(String),
          _v: 0
        });
      });
  });

  it('finds a list of tweets', () => {
    return Promise.all(['sophie', 'another handle'].map(createTweet))
      .then(createdTweets => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('gets a tweet by id', () => {
    return createTweet('sophie')
      .then(createdTweet => {
        return request(app)
          .get(`tweets/${createdTweet._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'ryan',
          text: 'hello tweets',
          _id: expect.any(String),
          _v: 0
        });
      });
  });

  it('errors when a bad id is sent', () => {
    return request(app)
      .get('/tweets');
  });
});
