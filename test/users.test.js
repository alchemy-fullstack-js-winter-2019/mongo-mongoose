require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
require('../lib/utils/connect')();
const app = require('../lib/app.js');
const mongoose = require('mongoose');
const User = require('../lib/models/Users');

describe('creates a user', () => {

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
  it.only('gets a list of users', () => {
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

});
