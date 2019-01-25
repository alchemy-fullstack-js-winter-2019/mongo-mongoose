require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const mongoose = require('mongoose');
const request = require('supertest');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');

const createUser = (handle, name, email) => {
  return User.create({ handle, name, email })
    .then(user => ({ ...user, _id: user._id.toString() }));
};

const createTweet = (handle, text = 'a tweet') => {
  return createUser(handle, 'sophie', 'sophie@email.com')
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

  it('can create a new tweet', () => {
    return createUser('sophie', 'sophie', 'sophie@email.com')
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

  it('finds a list of tweets', () => {
    return Promise.all(['sophie', 'another handle'].map(createTweet))
      .then(() => {
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
        });
      });
  });

  it('errors when a bad id is sent', () => {
    return request(app)
      .get('/tweets/5c479e5d22e69952c13506a8')
      .then(res => {
        expect(res.status).toEqual(404);
      });
  });

  it('updates a tweet by id', () => {
    return createTweet('sophie')
      .then(tweet => {
        return request(app)
          .patch(`/tweets/${tweet._id}`)
          .send({ text: 'Hi there! I am updated' });
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: expect.objectContaining({
            handle: 'sophie'
          }),
          text: 'Hi there! I am updated',
          _id: expect.any(String),
        });
      });
  });

  it('deletes a tweet by id', () => {
    return createTweet('sophie')
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
