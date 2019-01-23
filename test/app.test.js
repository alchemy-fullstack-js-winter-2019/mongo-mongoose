require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const mongoose = require('mongoose');
const request = require('supertest');
const Tweet = require('../lib/models/Tweet');

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

  it('can create a new tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'ryan',
        text: 'hello tweets',
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

  it('find a list of tweets', () => {
    return Promise.all(['ryan', 'another handle'].map(createTweet))
      .then(createdTweets => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('gets a tweet by id', () => {
    return createTweet('ryan')
      .then(createdTweet => {
        Promise.all([
          Promise.resolve(createdTweet._id),
          request(app)
            .get(`/tweets/${createdTweet._id}`)
        ]);
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'ryan',
          text: 'a tweet',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('errors when a bad id is sent', () => {
    return request(app)
      .get('/tweets/ (lots of characters)')
      .then(res => {
        expect(res.status);
      });
  });

  it('updates a tweet by id', () => {
    return createTweet('connor')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .patch(`/tweets/${_id}`)
          .send({
            text: 'updated tweet'
          })
          .then(res => {
            expect(res.body).toEqual({
              handle: 'connor',
              text: 'updated tweet',
              _id,
              __v: 0
            })
          })
      })
      
  });
});