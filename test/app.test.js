require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');


describe('tweets app', () => {
  const createUser = (handle, name, email) => {
    return User.create({ handle, name, email })
      .then(user => ({ ...user, _id: user._id.toString() }));
  };

  const createTweet = (handle, text = 'tweet!') => {
    return createUser(handle, 'ivan', 'ivan@espn.com')
      .then(user => {
        return Tweet.create({ handle: user._id, text })
          .then(createdTweet => ({ ...createdTweet, _id: createdTweet._id.toString() }));
      });
  };

  beforeAll(() => {
    connect();
  });

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  afterAll((done) => {
    mongoose.connection.close(done);
  });

  it('can create a new tweet', () => {
    return createUser('ballislife', 'ivan', 'ivan@espn.com')
      .then(user => {
        return request(app)
          .post('/tweets')
          .send({
            handle: user._id,
            text: 'What up!'
          })
          .then(res => {
            expect(res.body).toEqual({
              handle: expect.any(String),
              text: 'What up!',
              _id: expect.any(String),
              __v: 0
            });
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

  it('gets a tweet by id', () => {
    return createTweet('ivan')
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
          text: 'tweet!',
          _id,
          __v: 0
        });
      });
  });

  it('can find a tweet by id and update', () => {
    return createTweet('tweety')
      .then(createdTweet => {
        return request(app)
          .patch(`/tweets/${createdTweet._id}`)
          .send({ text: 'Banana!' });
      })
      .then(res => {  
        expect(res.body).toEqual({
          handle: expect.any(Object),
          text: 'Banana!',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('can find by id and delete', () => {
    return createTweet('tweet!')
      .then(createdTweet => {
        return request(app)
          .delete(`/tweets/${createdTweet._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ deleted: 1 });
      });
  });



  describe('users app', () => {
    beforeEach(done => {
      return mongoose.connection.dropDatabase(() => {
        done();
      });
    });

    it('can create a new user', () => {
      return request(app)
        .post('/users')
        .send({
          handle: 'ballislife',
          name: 'ivan',
          email: 'ivan@espn.com'
        })
        .then(res => {
          expect(res.body).toEqual({
            handle: 'ballislife',
            name: 'ivan',
            email: 'ivan@espn.com',
            _id: expect.any(String),
            __v: 0
          });
        });
    });

    it('gets a list of users', () => {
      return Promise.all(['user', 'user2', 'user3'].map(createUser))
        .then(() => {
          return request(app)
            .get('/users');
        })
        .then(res => {
          expect(res.body).toHaveLength(3);
        });
    });

    it('gets a user by id', () => {
      return createUser('ballislife', 'ivan', 'ivan@espn.com')
        .then(createdUser => {
          return request(app)
            .get(`/users/${createdUser._id}`)
            .then(res => {
              expect(res.body).toEqual({
                handle: 'ballislife',
                name: 'ivan',
                email: 'ivan@espn.com',
                _id: expect.any(String),
                __v: 0
              });
            });
        });
    });

    it('can find a user by id and update', () => {
      return createUser('ballislife', 'ivann', 'ivan@espn.com')
        .then(createdUser => {
          return Promise.all([
            Promise.resolve(createdUser._id),
            request(app)
              .patch(`/users/${createdUser._id}`)
              .send({ handle: 'ballislife', name: 'ivan', email: 'ivan@espn.com' })
          ]);  
        })
        .then(([_id, res]) => {  
          expect(res.body).toEqual({
            handle: 'ballislife',
            name: 'ivan',
            email: 'ivan@espn.com',
            _id,
            __v: 0
          });
        });
    });

    it('can find by id and delete', () => {
      return createUser('ballislife', 'ivan', 'ivan@espn.com')
        .then(createdUser => {
          return request(app)
            .delete(`/users/${createdUser._id}`);
        })
        .then(res => {
          expect(res.body).toEqual({ deleted: 1 });
        });
    });
  }); 
});
