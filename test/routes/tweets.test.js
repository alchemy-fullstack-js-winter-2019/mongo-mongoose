require('dotenv').config();
require('../../lib/utils/connect')();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../lib/app');
const Tweet = require('../../lib/models/Tweet');

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
    mongoose.connection.close();
    done();
  });

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
  });

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
  });

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
  });

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
  });

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
  });

  // ERROR HANDLING
  it('errors when tries to get tweet with bad id', () => {
    return createTweet('hayyyyyy')
      .then(createdTweet => {
        createdTweet._id = 3;
        return request(app)
          .get(`/tweets/${createdTweet._id}`)
          .then(res => {
            expect(res.status).toEqual(400);
            expect(res.body).toEqual({ error: 'Bad Id: 3' });
          });
      });
  });
});
