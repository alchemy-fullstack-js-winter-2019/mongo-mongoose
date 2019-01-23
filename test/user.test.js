/* eslint-disable no-console*/

require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const app = require('../lib/app');
const request = require('supertest');
const User = require('../lib/models/User');

describe('user test', () => {
  const createUser = (handle = 'ladybeard', name = 'kaiya', email = 'schnepherd@gmail.com') => {
    return User.create({ handle, name, email });
  };
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('creates a new usesr', () => {
    return request(app)
      .post('/users')
      .send({
        handle: 'ladybeard',
        name: 'kaiya',
        email: 'schnepherd@gmail.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'ladybeard',
          name: 'kaiya',
          email: 'schnepherd@gmail.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('finds user by id', () => {
    return createUser()
      .then(createdUser => {
        return request(app)
          .get(`/users/${createdUser._id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: 'ladybeard',
              name: 'kaiya',
              email: 'schnepherd@gmail.com',
              _id: expect.any(String),
              __v: 0
            });
          });
      });
  });

});
