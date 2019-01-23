require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const mongoose = require('mongoose');
const request = require('supertest');
const Tweet = require('../lib/models/Tweet');

describe('tweets app', () => {
  const createTweet = (handle, text = 'a tweet') => {
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
    .send({ 
      handle: 'dee',
      text: 'my first tweet',
   })
   .then(res => {
     console.log(res.body);
     expect(res.body).toEqual({
      handle: 'dee',
      text: 'my first tweet',
      _id: expect.any(String),
      __v: 0
     });
   });
  });
  it('finds a list of tweets', () => {
    return Promise.all(['user1', 'user2'].map(createTweet))
    .then(createdTweets => {
      return request(app)
     .get('/tweets')
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
    });
    it('find a tweet by id', () => {
      return createTweet('dee')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .get(`/tweets/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: 'dee',
              text: 'a tweet',
              _id: expect.any(String),
              __v: 0
        });
      });
    });
  });
    it('updates a tweet', () => {
      return createTweet('tweets')
      .then(createdTweet => {
        const id = createdTweet._id;
        return request(app)
        .put(`/tweets/${id}`)
        .send({
          handle: 'tweeter',
          text: 'hey tweet'
        })
        .then(() => {
          return request(app)
            .get(`/tweets/${id}`)
            .then(res => {
            expect(res.body).toEqual({
            handle: 'tweeter',
            text: 'hey tweet',
            _id: expect.any(String),
            __v: 0
          });
        });
      });
    });
    });
  })

