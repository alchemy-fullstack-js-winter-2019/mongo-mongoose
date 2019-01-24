require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

describe('users app', () => {

  const createUser = (handle, name = 'carmen', email = 'carmen@email.com') => {
    const userCreated = User.create({ handle, name, email });
    return userCreated;
  };

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  
  it('creates a user', () => {
    return request(app)
      .post('/users')
      .send({ handle: 'fruitlady', name: 'carmen', email: 'carmen@email.com' })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'fruitlady', 
          name: 'carmen', 
          email: 'carmen@email.com', 
          _id: expect.any(String), 
          __v: 0 
        });
      }); 
  });

  it('finds a list of users', () => {
    return Promise.all(
      ['user1', 'user2', 'user3'].map(createUser))
      .then(() => {
        return request(app)
          .get('/users');
      })
      .then(res => {
        expect(res.body).toHaveLength(3);
      });
  });

  it('gets a user by id', () => {
    return createUser('fruitlady')
      .then(createdUser => {
        return Promise.all([
          Promise.resolve(createdUser._id),
          request(app)
            .get(`/users/${createdUser._id}`)
        ]);
      })
      // eslint-disable-next-line no-unused-vars
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          handle: 'fruitlady',
          name: 'carmen',
          email: 'carmen@email.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('gets user by id and return an updated user', () => {
    return createUser('Carmen2')
      .then(updatedUser => {
        updatedUser.handle = 'Carmen';
        return request(app)
          .patch(`/users/${updatedUser._id}`)
          .send(updatedUser);
      })
      .then(res => {
        expect(res.body.handle).toEqual('Carmen');
      });
  });


});
