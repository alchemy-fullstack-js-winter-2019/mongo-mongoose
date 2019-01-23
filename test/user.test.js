/* eslint-disable no-unused-vars */
require ('dotenv').config();
require('../lib/utils/connect');
const app = require('../lib/app');
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('users app', () => {
  const createUser = ((handle, name, email) => {
    return User.create({ handle, name, email })
      .then(user => ({ ...user, _id: user._id.toString() }));
  };

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('creates a new user', () => {
    return request(app)
      .post('/users')
      .send({
        handle: 'abelq16',
        name: 'abel',
        email: 'abel.j.quintero@gmail.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'abelq16',
          name: 'abel',
          email: 'abel.j.quintero@gmail.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('finds a list of users', () => {
    return Promise.all(['juliaq', 'julia', 'juliaq@stanford.edu'].map(createUser)
      .then(createdUsers => {
        return request(app)
          .get('/users')
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  // it('finds a user by id', () => {

  // });

  // it('finds a user by id and updates', () => {

  // });

  // it('finds a user by id and deletes', () => {

  // });

  afterAll((done) => {
    mongoose.connection.close(done);
  });
});



