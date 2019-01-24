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
    // create user first
    return createUser(handle, 'mike', 'mike@mike.mike')
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
  afterAll((done) => {
    mongoose.connection.close(done);
  });

  it('creates a new tweet', () => {
    return createUser('docswithoutsocks', 'Dr Julius Hibbard', 'drj@thesimpsons.com')
      .then(user => {
        return request(app)
          .post('/tweets')
          .send({
            handle: user._id,
            text: 'my 1st tweet'
          });
      })
      .then(res => {
        // console.log('banana', res.body);
        expect(res.body).toEqual({
          handle: expect.any(String),
          text: 'my 1st tweet',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('finds all the tweets', () => {
    return Promise.all(['mike', 'mike2'].map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        // console.log('Fluffy mice & kittens', res.body);
        expect(res.body).toHaveLength(2);
      });
  });
  it('gets a tweet by id', () => {
    return createTweet('mike')
      .then(createdTweet => {
        return Promise.all([
          Promise.resolve(createdTweet._id),
          request(app)
            .get(`/tweets/${createdTweet._id}`)
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          handle: expect.any(Object),
          text: 'a tweet',
          _id,
          __v: 0
        });
      });
  });
  it.only('finds by Id and updates', () => {
    return createTweet('mike')
      .then(createdTweet => {
        return request(app)
          .patch(`/tweets/${createdTweet._id}`)
          .send({ text: 'lancemongoose' });
      })
      .then(res => {
      // console.log('banana', res.body);
        expect(res.body).toEqual({
          handle: expect.any(Object),
          text: expect.any(String),
          _id: expect.any(String),
          __v: 0
        });
      });
  });
  
  it('finds by Id and deletes', () => {
    return createTweet('mike')
      .then(createdTweet => {
        expect(createdTweet.handle).toEqual('mike');
        return request(app)
          .delete(`/tweets/${createdTweet.id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ deleted: 1 });
      });

  });
});
