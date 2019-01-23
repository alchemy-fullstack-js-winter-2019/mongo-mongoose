require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const mongoose = require('mongoose');
const request = require('supertest');
const Tweet = require('../lib/models/Tweet');

describe('tweets app', () => {
  const createTweet = (handle, text = 'this is tweet text') => {
    return Tweet.create({ handle, text })
  }

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => { 
    done();
    });
  });

  it('creates a new tweet', () => {
    return request(app)
    .post('/tweets')
    .send({ handle: 'mike', text: 'my 1st tweet' })
    .then(res => {
      // console.log('banana', res.body);
      expect(res.body).toEqual({
          handle: 'mike',
          text: 'my 1st tweet',
          _id: expect.any(String),
          __v: 0
        });
      });
    });
    it('finds all the tweets', () => {
      return Promise.all(['fannyserverpackets', 'another handle'].map(createTweet))
        .then(createdTweets => {
          return request(app)
            .get('/tweets')
        })
        .then(res => {
          expect(res.body).toHaveLength(2);
        });
    });
    afterAll(() => {
      mongoose.disconnect();
  });
  });
