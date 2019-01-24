const request = require('supertest');
require('dotenv').config();//module for configuration
require('../lib/utils/connect')();//connects to db
const app = require('../lib/app.js');
const mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
const creatUser = (handle, name = 'johnny', email = 'email.com') => {
  return User.create({ handle, name, email });
};

describe('creates a user', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  it.only('creates a user', ()=> {
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

});
//notes