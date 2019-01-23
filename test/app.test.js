require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');
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

  it('creates a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({ handle: 'carmen', text: 'my first tweet' })
      .then(res => {
        
        expect(res.body).toEqual({
          handle: 'carmen', text: 'my first tweet', _id: expect.any(String),
          __v: 0 
        });
      }); 
  });

  it('finds a list of tweets', () => {
    return Promise.all(['carmen', 'another handle'].map(createTweet))
      .then(createdTweets => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });
});


