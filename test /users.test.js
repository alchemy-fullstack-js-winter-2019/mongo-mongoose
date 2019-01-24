require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const mongoose = require('mongoose');
const request = require('supertest');
const User = require('../lib/models/User');

describe('users app', () => {
  const createUser = (handle = 'xtester', name = 'kevin', email = 'barrywhite@dionwarwick.com') => {
    return User.create({ handle, name, email });
  };

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  afterAll((done) => {
    mongoose.connection.close(done);
  });

  it('creates a new user', () => {
    return request(app)
      .post('/users')
      .send({ handle: 'mike', name: 'michael', email: 'mymichael@mymichael.com' })
      .then(res => {
        // console.log('banana', res.body);
        expect(res.body).toEqual({
          handle: 'mike',
          name: 'michael',
          email: 'mymichael@mymichael.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('finds all the users', () => {
    return Promise.all(['fannyserverpackets', 'another handle'].map(createUser))
      .then(() => {
        return request(app)
          .get('/users');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });
  it('gets a user by id', () => {
    return createUser('xtester')
      .then(createdUser => {
        return Promise.all([
          Promise.resolve(createdUser._id),
          request(app)
            .get(`/users/${createdUser._id}`)
        ]);
      })
      .then(([_id, res]) => {
        // console.log('Are you receiving',res.body);
        expect(res.body).toEqual({
          handle: 'xtester',
          name: 'kevin',
          email: 'barrywhite@dionwarwick.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
  it('finds user by Id and updates', () => {
    return createUser('xtester')
      .then(createdUser => {
        return request(app)
          .patch(`/users/${createdUser.id}`)
          .send({ handle: 'lancemongoose' });
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'lancemongoose',
          name: 'kevin',
          email: 'barrywhite@dionwarwick.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
  it('finds user by Id and deletes', () => {
    return createUser('mike')
      .then(createdUser => {
        expect(createdUser.handle).toEqual('mike');
        return request(app)
          .delete(`/users/${createdUser.id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ deleted: 1 });
      });

  });
});
