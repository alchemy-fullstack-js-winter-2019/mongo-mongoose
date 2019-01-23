require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const request = require('supertest');
const mongoose = require('mongoose');

const createUser = (handle, name, email) => {
  return request(app)
    .post('/users')
    .send({
      handle: handle,
      name: 'teonna',
      email: 'teonna@heintz.com'
    })
    .then(res => res.body);
};


const createTweet = (handle, text = 'default text') => {
  const name = 'default name';
  const email = 'default email';
  return createUser(handle, name, email)
    .then(createdUser => {
      return request(app)
        .post('/tweets')
        .send({
          handle: createdUser._id,
          text
        })
        .then(res => res.body);
    });
};

describe('tweets app', () => {
  
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('creates a tweet', () => {
    return createUser('TT')
      .then(createdUser => {
        return request(app)
          .post('/tweets')
          .send({ handle: createdUser._id, text: 'my first tweet' })
          .then(res => {
            expect(res.body).toEqual({ 
              handle: createdUser._id,
              text: 'my first tweet',
              _id: expect.any(String),
              __v: 0
            });
          });

      });
  });
  
  it('gets a list of tweets', () => {
    const handles = ['TA1', 'TA2', 'TA3'];
    return Promise.all(handles.map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets')
          .then(res => {
            expect(res.body).toHaveLength(3);
          });
      });
  });

  it('finds by id', () => {
    return createTweet('TT')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .get(`/tweets/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: {
                handle: 'TT',
                email: 'teonna@heintz.com',
                name: 'teonna',
                __v: 0,
                _id: expect.any(String)
              },
              text: 'default text',
              _id,
              __v: 0
            });
          });
      });
  });
 
  it('updates a tweet', () => {
    return createTweet('TeeTee')
      .then(createdTweet => {
        const id = createdTweet._id;
        return request(app)
          .patch(`/tweets/${id}`)
          .send({
            text: 'update text',
          })
          .then(() => {
            return request(app)
              .get(`/tweets/${id}`)
              .then(res => {
                expect(res.body).toEqual({
                  handle: {
                    handle: 'TeeTee',
                    email: 'teonna@heintz.com',
                    name: 'teonna',
                    __v: 0,
                    _id: expect.any(String)
                  },
                  text: 'update text',
                  _id: expect.any(String),
                  __v: 0
                });
              });
          });
      });
  });

  it('deletes a tweet by id', () => {
    return createTweet('deleted')
      .then(createdTweet => {
        return request(app)
          .delete(`/tweets/${createdTweet._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ 
          handle: {
            handle: 'deleted',
            email: 'teonna@heintz.com',
            name: 'teonna',
            __v: 0,
            _id: expect.any(String) 
          },
          text: 'default text',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
});


describe('users', () => {

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('creates a user', () => {
    return request(app)
      .post('/users')
      .send({ 
        handle: 'TA',
        name: 'Teonna',
        email: 'teonna@heintz.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'TA',
          name: 'Teonna',
          email: 'teonna@heintz.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
  it('finds a list of users', () => {
    return Promise.all(['TT', 'TA'].map(createUser))
      .then(() => {
        return request(app)
          .get('/users');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });
  it('finds by id', () => {
    return createUser('TMZ')
      .then(createdUser => {
        const id = createdUser._id;
        return request(app)
          .get(`/users/${id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: 'TMZ',
              name: 'teonna',
              email: 'teonna@heintz.com',
              _id: expect.any(String),
              __v: 0
            });
          });
      });
  });

  it('updates a user by id', () => {
    return createUser('T_on_A')
      .then(createdUser => {
        return request(app)
          .patch(`/users/${createdUser._id}`)
          .send({
            handle: 'T_on_A',
            name: 'tatiana',
            email: 'teonna@heintz.com'
          })
          .then(() => {
            return request(app)
              .get(`/users/${createdUser._id}`)
              .then(res => {
                expect(res.body).toEqual({
                  handle: 'T_on_A',
                  name: 'tatiana',
                  email: 'teonna@heintz.com',
                  _id: expect.any(String),
                  __v:0
                });
              });
          });
      });
  });
  it('deletes a user by id', () => {
    return createUser('deleted')
      .then(createdUser => {
        return request(app)
          .delete(`/users/${createdUser._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'deleted',
          name: 'teonna',
          email: 'teonna@heintz.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

});
