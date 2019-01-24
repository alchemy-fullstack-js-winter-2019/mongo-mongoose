/* eslint-disable no-console */
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
    return createUser(handle, 'dee', 'dee@gmail.com')
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

  it('creates a new tweet', () => {
    return createUser('dee', 'dee', 'dee@gmail.com')
      .then(user => {
        return request(app)
          .post('/tweets')
          .send({ 
            handle: user._id,
            text: 'my first tweet'
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
    return Promise.all(['user1', 'user2'].map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });
  it('find a tweet by id', () => {
    return createTweet('dee')
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

  it('updates a tweet', () => {
    return createTweet('dee')
      .then(createdTweet => {
        return Promise.all([
          Promise.resolve(createdTweet._id),
          request(app)
            .patch(`/tweets/${createdTweet._id}`)
            .send({
              text: 'an updated tweet'
            })
        ]);
      })
      .then(([_id]) => {
        return request(app)
          .get(`/tweets/${_id}`)
          .then((res => {
            expect(res.body.text).toEqual('an updated tweet');
          }));
      });
  });

  it('deletes a tweet', () => {
    return createTweet('dee')
      .then(createdTweet => {
        const id = createdTweet._id;
        return request(app)
          .delete(`/tweets/${id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: expect.any(String),
              text: 'a tweet',
              _id: expect.any(String),
              __v: 0
            });
          });
      });
  });

  describe('users app', () => {
    const createUser = (handle, name = 'meme', email = 'meme@gmail.com') => {
      return User.create({ handle, name, email });
    };
    beforeEach(done => {
      return mongoose.connection.dropDatabase(() => {
        done();
      });
    });

    it('creates a user', () => {
      return request(app)
        .post('/users')
        .send({
          handle: 'user1',
          name: 'Meme',
          email: 'meme@gmail.com'
        })
        .then(res => {
          expect(res.body).toEqual({
            handle: 'user1',
            name: 'Meme',
            email: 'meme@gmail.com',
            _id: expect.any(String),
            __v: 0
          });
        });
    });
    it('gets list of users', () => {
      return Promise.all(['user1', 'user2', 'user3'].map(createUser))
        .then(() => {
          return request(app)
            .get('/users');
        })
        .then(res => {
          expect(res.body).toHaveLength(3);
        });
    });
    it('gets a user by id', () => {
      return createUser('user100')
        .then(createdUser => {
          const id = createdUser._id;
          return request(app)
            .get(`/users/${id}`);
        })
        .then(res => {
          expect(res.body).toEqual({
            handle: expect.any(String),
            name: 'meme',
            email: 'meme@gmail.com',
            _id: expect.any(String),
            __v: 0
          });
        });
    });
    it('updates a user', () => {
      return createUser('user100')
        .then(createdUser => {
          const id = createdUser._id;
          return request(app)
            .patch(`/tweets/${id}`)
            .send({
              handle: 'user200',
              name: 'newbie',
              email: 'newbie@gmail.com'
            });
        });
    });
    it('deletes a user by id', () => {
      return createUser('dee')
        .then(createdUser => {
          return request(app)
            .delete(`/users/${createdUser._id}`)
            .then(res => {
              expect(res.body).toEqual({
                deleted: 1
              });
            });
        });
    });
  });
});
