require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');

const createUser = (handle, name = 'paige', email = 'bob@ross.com') => {
  return User.create({ handle, name, email })
    .then(createdUser => ({ ...createdUser, _id: createdUser._id.toString () }));
};

const createTweet = (handle, text = 'oink tweet moo') => {
  const name = 'paige';
  const email = 'bob@ross.com';
  return createUser(handle, name, email)
    .then(createdUser => {
      return Tweet.create({ 
        handle: createdUser._id, 
        text 
      });
    });
};

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('can get a list of tweets from our db', () => {
    const tweetsToCreate = ['yoyo', 'jelly123', 'jessie456'];
    return Promise.all(tweetsToCreate.map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(3);
      });
  });

  it('can post a tweet', () => {
    return createUser('banana')
      .then(createdUser => {
        return request(app)
          .post('/tweets')
          .send({ 
            handle: createdUser._id, 
            text: 'greek or nah?' 
          })
          .then(res => {
            expect(res.body).toEqual({ 
              __v: 0, 
              _id: expect.any(String), 
              handle: expect.any(String), 
              text: 'greek or nah?' 
            });
          });
      });
  });

  it('can get a tweet by its id', () => {
    return createTweet('shezza')
      .then(res => {
        return request(app)
          .get(`/tweets/${res._id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: expect.any(Object),
              text: 'oink tweet moo',
              _id: expect.any(String)
            });
          });
      });
  });

  it('can update a tweet', () => {
    let newTweet = { text: 'ele-FANT-eh' };
    return createTweet('ele4ant3')
      .then(res => {
        return request(app)
          .patch(`/tweets/${res._id}`)
          .send(newTweet)
          .then(res => {
            expect(res.body).toEqual({ 
              handle: expect.any(Object), 
              text: 'ele-FANT-eh', 
              _id: expect.any(String)
            });
          });
      });
  });

  it('can delete a tweet', () => {
    return createTweet('m3m3lord')
      .then(res => {
        return request(app)
          .delete(`/tweets/${res._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ deleted: 1 });
      });
  });

  it('creates a user', () => {
    return request(app)
      .post('/users')
      .send({ handle: 'paige', name: 'paigegorry', email: 'me@me.com' })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String), 
          handle: 'paige', 
          name: 'paigegorry', 
          email: 'me@me.com' 
        });
      });
  });

  it('gets a list of users', () => {
    return request(app)
      .post('/users')
      .send({
        handle: 'paige1',
        name: 'paige',
        email: 'paige1'
      })
      .then(() => {
        return request(app)
          .post('/users')
          .send({
            handle: 'paige1',
            name: 'paige',
            email: 'paige1'
          });
      })
      .then(() => {
        return request(app)
          .get('/users');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('can get a user by its id', () => {
    return createUser('b4nana')
      .then(res => {
        return request(app)
          .get(`/users/${res._id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: 'b4nana',
              name: 'paige',
              email: 'bob@ross.com',
              __v: 0,
              _id: expect.any(String)
            });
          });
      });
  });

  it('can get a user by id and update', () => {
    let newUser = { name: 'yogurt', email: 'yo@go.com' };
    return createUser('yoyo')
      .then(res => {
        return request(app)
          .patch(`/users/${res._id}`)
          .send(newUser);
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'yoyo',
          name: 'yogurt',
          email: 'yo@go.com',
          __v: 0,
          _id: expect.any(String)
        });
      });
  });

  it('can find by id and delete', () => {
    return createUser('benedrylcumberbottom')
      .then(res => {
        return request(app)
          .delete(`/users/${res._id}`);
      }) .then(res => {
        expect(res.body).toEqual({
          handle: 'benedrylcumberbottom',
          name: 'paige',
          email: 'bob@ross.com',
          __v: 0,
          _id: expect.any(String)
        });
      });
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  }); 
});
