require('dotenv').config();
require('../lib/utils/connect')();

const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');

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
});
