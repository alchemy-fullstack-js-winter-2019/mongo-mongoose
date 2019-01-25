const request = require('supertest');
require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app.js');
const mongoose = require('mongoose');


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
