require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');

const createUsers = (handle, name = 'Aaron', email = 'AMDennis1987@gmail.com') => {
  return request(app)
    .post('/users')
    .send({
      handle,
      name,
      email
    })
    .then(res => res.body);
};

describe('users app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('can create a user', () => {
    return request(app)
      .post('/users')
      .send({
        handle: 'Aaron2',
        name: 'Aaron',
        email: 'AMDennis1987@gmail.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'Aaron2',
          name: 'Aaron',
          email: 'AMDennis1987@gmail.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('gets a list of all users', () => {
    const usersToCreate = ['Hola', 'Hola2'];
    return Promise.all(usersToCreate.map(createUsers))
      .then(() => {
        return request(app)
          .get('/users');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(2);
      });
  });

  it('gets a single user by id', () => {
    return createUsers('Aaron2')
      .then(createdUser => {
        return Promise.all([
          Promise.resolve(createdUser._id),
          request(app)
            .get(`/users/${createdUser._id}`)
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          handle: 'Aaron2',
          name: 'Aaron',
          email: 'AMDennis1987@gmail.com',
          _id,
          __v: 0
        });
      });
  });

  it('finds a user by id and updates it', () => {
    return createUsers('Peter')
      .then(updatedUser => {
        updatedUser.handle = 'Peter2';
        return request(app)
          .patch(`/users/${updatedUser._id}`)
          .send(updatedUser);
      })
      .then(res => {
        expect(res.text).toContain('Peter2');
      });
  });

  it('finds by id and deletes object', () => {
    return createUsers('Peter')
      .then(createdUsers => {
        const id = createdUsers._id;
        return request(app)
          .delete(`/users/${id}`)
          .then(res => {
            expect(res.body).toEqual({ 'deleted': 1 });
          });
      });
  });
});
