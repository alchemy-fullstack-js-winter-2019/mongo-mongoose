/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const request = require('supertest');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');


describe('tweets app', () => {

  const createUser = (handle, name, email) => {
    return User.create({ handle, name, email })
      .then(user => ({ ...user, _id: user._id.toString() }));
  };

  const createTweet = ((handle, text = 'my first tweet') => {
    return createUser(handle, 'abel', 'abel.j.quintero@gmail.com')
      .then(user => {
        return Tweet.create({ handle: user._id, text })
          .then(tweet => ({ ...tweet, _id: tweet._id.toString() }));
      });
  });

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });


  // start tests

  it.only('creates a new tweet', () => {
    return createUser('abelq16', 'abel', 'abel.j.quintero@gmail.com')
      
      .then(user => {
        return request(app)
          .post('/tweets')
          .send({
            handle: user._id,
            text: 'my first tweet',
            _id: '',
            __v: 0
          })
          .then(res => {

            expect(res.body).toEqual({
              handle: expect.any(String),
              text: 'my first tweet',
              _id: expect.any(String),
              __v: 0
            });
          });
      });
  });

  it('finds a list of tweets', () => {
    return Promise.all(['abel', 'another handle'].map(createTweet))
      .then(createdTweets => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('can find a tweet by id', () => {
    
    return createTweet('abel')
      .then(createdTweet => {
        Promise.resolve(createdTweet._id),
        request(app)
          .get(`/tweets/${createdTweet._id}`);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          handle: 'abelq16',
          text: 'my first tweet',
          _id: expect.any(String),
          __v: 0
        });
      });
  });


  it('errors when a bad id is sent', () => {
    return request(app)
      .get('/tweets/badId')
      .then(res => {
        expect(res.status).toEqual(400);
      });
  });

  it('can find by id and update', () => {
    return createTweet('abel')
      .then(tweet => {
        return request(app)
          .patch(`/tweets/${tweet._id}`)
          .send({ text: 'I am updated tweet' });
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: expect.objectContaining({
            handle: 'abelq16'
          }),
          text: 'I am updated tweet',
          _id: expect.any(String),
        });
      });
  });

  it('can find by id and delete', () => {
    return createTweet('tweet to be deleted')
      .then(newTweet => {
        return request(app)
          .delete(`/tweets/${newTweet._id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });

  });


  afterAll((done) => {
    mongoose.connection.close(done);
  });

});
