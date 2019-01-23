require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');

const createTweet = (handle) => {
  return createUser(handle)
    .then(createdUser => {
      return request(app)
        .post('/tweets')
        .send({ 
          handle: createdUser._id,
          text: 'some text'
        })
        .then(res => res.body);
    });   
};

const createUser = (name) => {
  return request(app)
    .post('/users')
    .send({ 
      handle: 'whatislife',
      name: name,
      email: 'test@gmail.com'
    })
    .then(res => res.body);
};

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  beforeEach(done => {
    createTweet('General Roxy');
    done();
  });

  it('creates a new tweet', () => {
    return createUser('test user')
      .then(createdUser => {
        return request(app)
          .post('/tweets')
          .send({
            handle: createdUser._id,
            text: 'longboarding life yo'
          })
          .then(res => {
            expect(res.body).toEqual({
              handle: createdUser._id,
              text: 'longboarding life yo',
              _id: expect.any(String),
              __v: 0
            });
          });

      });
  });

  it('can list all the tweets in the database', () => {
    const handles = ['roxy1', 'roxy2', 'roxy3', 'roxy4'];
    return Promise.all(handles.map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(5);
      });
  });

  it('gets a tweet by id', () => {
    return createTweet('kristin1')
      .then(createdTweet => {
        return request(app) 
          .get(`/tweets/${createdTweet._id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: expect.any(Object),
              text: 'some text',
              _id: expect.any(String),
              __v: 0
            });
          });
      });
  });

  it('updates a tweet with :id and returns the update', () => {
    return createTweet('kristin1')
      .then(createdTweet => {
        createdTweet.text = 'new text';
        return request(app)
          .patch(`/tweets/${createdTweet._id}`)
          .send(createdTweet);
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: expect.any(Object),
          text: 'new text',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('deletes a tweet with :id and returns the delete count', () => {
    return createTweet('baller for lyfe')
      .then((createdTweet) => {
        const id = createdTweet._id;
        return request(app)
          .delete(`/tweets/${id}`)
          .then(res => {
            expect(res.body).toEqual({ 'deleted': 1 });
          });
      });
  });
});

describe('users app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  beforeEach(done => {
    createUser('General Roxy');
    done();
  });

  it('creates a new user', () => {
    return request(app)
      .post('/users')
      .send({
        handle: 'ghostrider',
        name: 'Joe',
        email: 'testing@gmail.com'
      })
      .then(res => {
        expect(res.body.email).toEqual('testing@gmail.com');
      });
  });

  it('can list all the users in the database', () => {
    const handles = ['roxy1', 'roxy2', 'roxy3', 'roxy4'];
    return Promise.all(handles.map(createUser))
      .then(() => {
        return request(app)
          .get('/users');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(5);
      });
  });

  it('gets a user by id', () => {
    return createUser('kristin1')
      .then(createdUser => {
        return request(app) 
          .get(`/users/${createdUser._id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: 'whatislife',
              name: 'kristin1',
              email: 'test@gmail.com',
              _id: expect.any(String),
              __v: 0
            });
          });
      });
  });

  it('updates a user with :id and returns the update', () => {
    return createUser('kristin1')
      .then(createdUser => {
        createdUser.name = 'test';
        return request(app)
          .patch(`/users/${createdUser._id}`)
          .send(createdUser);
      })
      .then(res => {
        expect(res.text).toContain('test');
      });
  });

  it('deletes a user with :id and returns the delete count', () => {
    return createUser('siberian tiger')
      .then((createdUser) => {
        const id = createdUser._id;
        return request(app)
          .delete(`/users/${id}`)
          .then(res => {
            expect(res.body).toEqual({ 'deleted': 1 });
          });
      });
  });
});
