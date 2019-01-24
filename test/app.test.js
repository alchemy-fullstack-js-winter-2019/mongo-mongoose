require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../lib/app');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');

jest.mock('../lib/services/ronSwansonApi.js');

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
const createTweet = (handle, text = 'hi I a tweet') => {
  return createUser(handle, 'createdTweetName', 'createdTweetEmail')
    .then(createdUser => {
      return Tweet.create({
        handle: createdUser._id,
        text
      })
        .then(tweet => ({
          ...tweet,
          _id: tweet._id.toString()
        }));
    });
};

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  afterAll(done => {
    createTweet('seedDataHandleA', 'seedDataTextA');
    createUser('seedDataHandleB', 'seedDataNameB', 'seedDataEmailB');
    mongoose.disconnect();
    done();
  });

  // POST ------------------------------------------
  describe('POST', () => {
    it('can create a new tweet', () => {
      return createUser('2cool', 'Bubs', 'email@e.com')
        .then(createdUser => {
          return request(app)
            .post('/tweets')
            .send({
              handle: createdUser._id,
              text: 'hiya tweety'
            })
            .then(res => {
              expect(res.body).toEqual({
                handle: createdUser._id,
                text: 'hiya tweety',
                _id: expect.any(String),
                __v: 0
              });
            });
        });
    });
    it('can create a tweet with a random quote', () => {
      return createUser('evenCooler', 'Bertha', 'bye@e.com')
        .then(createdUser => {
          return request(app)
            .post('/tweets?random=true')
            .send({
              handle: createdUser._id
            })
            .then(res => {
              expect(res.body).toEqual({
                handle: createdUser._id,
                text: 'I wanna punch you in the face so bad right now.',
                _id: expect.any(String),
                __v: 0
              });
            });
        });
    });
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

  // GET ------------------------------------------
  describe('GET', () => {
    it('can get a list of tweets from db', () => {
      const tweetsToCreate = ['hey', 'hi', 'hello', 'hola'];
      return Promise.all(tweetsToCreate.map(createTweet))
        .then(() => {
          return request(app)
            .get('/tweets');
        })
        .then(({ body }) => {
          expect(body).toHaveLength(4);
        });
    });
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

  // GET by id
  describe('GET by :id', () => {
    it('can get a tweet by id', () => {
      return createTweet('hayyyyyy')
        .then(createdTweet => {
          const _id = createdTweet._id;
          return request(app)
            .get(`/tweets/${_id}`)
            .then(res => {
              expect(res.body).toEqual({
                handle: {
                  handle: 'hayyyyyy'
                },
                text: 'hi I a tweet',
                _id
              });
            });
        });
    });
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

  // PATCH ------------------------------------------
  describe('PATCH  by :id', () => {
    it('can retrieve a tweet by :id and update it', () => {
      const newTweet = {
        text: 'newText'
      };
      return createTweet('flanel', 'blahblah', 'e@e.com')
        .then(createdTweet => {
          const _id = createdTweet._id;
          return request(app)
            .patch(`/tweets/${_id}`)
            .send(newTweet);
        })
        .then(res => {
          expect(res.body).toEqual({
            _id: expect.any(String),
            handle: {
              handle: 'flanel'
            },
            text: 'newText'
          });
        });
    });

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

  // DELETE ------------------------------------------
  describe('DELETE  by :id', () => {
    it('can retrieve a tweet by :id, delete, and return the delete count', () => {
      return createTweet('alo')
        .then(createdTweet => {
          const _id = createdTweet._id;
          return request(app)
            .delete(`/tweets/${_id}`)
            .then(res => {
              expect(res.body).toEqual({ deleted: 1 });
              return Tweet.findById(_id)
                .then(res => {
                  expect(res).toBeNull();
                });
            });
        });
    });
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
});
