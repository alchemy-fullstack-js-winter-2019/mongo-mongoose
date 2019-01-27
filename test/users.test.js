require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
require('../lib/utils/connect')();
const app = require('../lib/app.js');
const mongoose = require('mongoose');
const User = require('../lib/models/Users');

describe('creates a user', () => {

  // const createUser = (handle, name = 'johnny', email = 'email') => {
  //   const userCreated = User.create({ handle, name, email });
  //   return userCreated;
  // };
  const createUser = (handle, name = 'johnny', email = 'email') => {
    return request(app)
      .post('/users')
      .send({
        handle: handle,
        name: name,
        email: email
      })
      .then(res => res.body);
  };
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  it('creates a user', ()=> {
    return request(app)
      .post('/users')
      .send({ 
        handle: 'handle',
        name: 'johnny',
        email: 'email.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'handle',
          name: 'johnny',
          email: 'email.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
  it('gets a list of users', () => {
    return Promise.all(['one', 'two', 'three'].map(newUsers => {
      return createUser(newUsers);
    }))
      .then(() => {
        return request(app)
          .get('/users');
      })
      .then(res => {
        expect(res.body).toHaveLength(3);
      });

  });

  it('gets user by Id', () => {
    return createUser('some')
      .then(createdUser => {
        return Promise.all([
          Promise.resolve(createdUser._id),
          request(app)
            .get(`/users/${createdUser._id}`)
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          handle: 'some',
          name: 'johnny',
          email: 'email',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it.only('find by ID and updates', () => {
    return createUser('pleaseUpdate')
      .then(createdUser => {
        return Promise.all([
          Promise.resolve(createdUser._id),
          request(app)
            .patch(`/users/${createdUser._id}`)
            .send({ handle: 'updated' })
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual ({
          handle: 'updated',
          name: 'johnny',
          email: 'email',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

});