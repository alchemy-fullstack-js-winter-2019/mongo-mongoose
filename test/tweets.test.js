require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const mongoose = require('mongoose');
const request = require('supertest');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');

describe('tweets app', () => {
  const createUser = (handle, name, email) => {
    return User.create({ handle, name, email })
      .then(user => ({ ...user, _id: user._id.toString() }));
  };
  
  const createTweet = (handle, text = 'a tweet') => {
    return createUser(handle, 'jei', 'jj@gmail')
      .then(user => {
        return Tweet.create({ handle: user._id, text })
          .then(tweet => ({ ...tweet, _id: tweet._id.toString() }));
      });
  };

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done(); 
    });
  });

  it('can create a new tweet', () => {
    return createUser('jei', 'jei', 'jei@gmail.com')
      .then(user => {
        return request(app)
          .post('/tweets')
          .send({
            handle: user._id,
            text: 'hello'
          })
          .then(res => {
            expect(res.body).toEqual({
              handle : expect.any(String),
              text: 'hello',
              _id: expect.any(String),
              __v: 0
            });
          });
      });
  });

  it('finds a list of tweets', () => {
    return Promise.all(['jei', 'jz'].map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('can get tweet by id', () => {
    return createTweet('hey')
      .then(createdTweet => {
        return Promise.all([
          Promise.resolve(createdTweet._id),
          request(app)
            .get(`/tweets/${createdTweet._id}`)
        ]);
      })
      .then(([_id, res])=> {
        expect(res.body).toEqual({
          handle: expect.any(Object),
          text: 'a tweet',
          _id,
          __v: 0
        });
      });
  });
  
  it('updates a tweet by id', () => {
    return createTweet('jei')
      .then(tweet => {
        return request(app)
          .patch(`/tweets/${tweet._id}`)
          .send({ text: 'hello dolly' });
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'jei',
          text: 'updated tweets',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('deletes tweet by id', () => {
    return createTweet('jei')
      .then(tweet => {
        return Promise.all([
          Promise.resolve(tweet._id),
          request(app)
            .delete(`/tweets/${tweet._id}`)
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({ deleted: 1 });
        return request(app)
          .get(`/tweets/${_id}`);
      })
      .then(res => {
        expect(res.status).toEqual(404);
      });
  
  });
});
