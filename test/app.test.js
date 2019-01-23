require('dotenv').config();
require('../lib/utils/connect')();

const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');

describe('tweets app', () => {

  const createTweet = (handle, text = 'a tweet') => {
    return request(app)
      .post('/tweets')
      .send({ handle, text })
      .then(res => res.body);
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
        handle: 'ivan',
        text: 'Hello World',
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'ivan',
          text: 'Hello World',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('gets a list of tweets', () => {
    return Promise.all(['yo!', 'hi!', 'bye felicia!'].map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(3);
      });
  });
});

