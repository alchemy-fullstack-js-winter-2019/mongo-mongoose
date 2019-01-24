require('dotenv').config();
require('../../lib/utils/connect')();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../lib/app');
const User = require('../../lib/models/User');

jest.mock('../../lib/services/ronSwansonApi.js');

const createUser = (handle, name, email) => {
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
  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  describe('POST', () => {
    it('can create a new user', () => {
      return request(app)
        .post('/users')
        .send({
          handle: 'newcooluser',
          name: 'Cool Person McGee',
          email: 'cool@cool.com'
        })
        .then(res => {
          expect(res.body).toEqual({
            handle: 'newcooluser',
            name: 'Cool Person McGee',
            email: 'cool@cool.com',
            _id: expect.any(String),
            __v: 0
          });
        });
    });
  });

  describe('GET', () => {
    it('can get a list of users from db', () => {
      return request(app)
        .post('/users')
        .send({
          handle: 'handleA',
          name: 'nameA',
          email: 'emailA'
        })
        .then(() => {
          return request(app)
            .post('/users')
            .send({
              handle: 'handleB',
              name: 'nameB',
              email: 'emailB'
            });
        })
        .then(() => {
          return request(app)
            .get('/users');
        })
        .then(({ body }) => {
          expect(body).toHaveLength(2);
        });
    });
  });

  describe('GET by :id', () => {
    it('can get a user by id', () => {
      return createUser(
        '2cool4skool', 'Michael MacDonald', 'smoothjams@hotmail.com'
      )
        .then(createdUser => {
          const _id = createdUser._id;
          return request(app)
            .get(`/users/${_id}`)
            .then(res => {
              expect(res.body).toEqual({
                handle: '2cool4skool',
                name: 'Michael MacDonald',
                email: 'smoothjams@hotmail.com',
                _id,
                __v: 0
              });
            });
        });
    });
  });

  describe('PATCH  by :id', () => {
    it('can retrieve a user by :id and update only name and email', () => { 
      const newUser = { name: 'booboo head', email: 'b@b.biz' };
      return createUser(
        'Baby Pie', 'Angel Face', 'angel@heaven.com'
      )
        .then(createdUser => {
          const _id = createdUser._id;
          return request(app)
            .patch(`/users/${_id}`)
            .send(newUser);
        })
        .then(res => {
          expect(res.body).toEqual({
            _id: expect.any(String),
            handle: 'Baby Pie',
            name: 'booboo head',
            email: 'b@b.biz',
            __v: 0
          });
        });
    });
  });

  describe('DELETE  by :id', () => {
    it('can retrieve a user by :id, delete, and return the delete count', () => {
      return createUser('music2myEARS', 'YoYo Ma', 'v@v.com')
        .then(createdUser => {
          const _id = createdUser._id;
          return request(app)
            .delete(`/users/${_id}`)
            .then(res => {
              expect(res.body).toEqual({ deleted: 1 });
              return User.findById(_id)
                .then(res => {
                  expect(res).toBeNull();
                });
            });
        });
    });
  });

  // ERROR HANDLING
  it('errors when tries to get user with bad id', () => {
    return createUser(
      'butterJamz', 'Fanny H.', 'marmalade@u.biz'
    )
      .then(createdUser => {
        createdUser._id = 420;
        return request(app)
          .get(`/users/${createdUser._id}`)
          .then(res => {
            expect(res.status).toEqual(400);
            expect(res.body).toEqual({ error: 'Bad Id: 420' });
          });
      });
  });

});
