/* eslint-disable no-console*/

require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const app = require('../lib/app');
const request = require('supertest');

const makeTweet = (text) => {
  return request(app)
    .post('/tweets')
    .send({
      handle: 'ladybeard',
      text: text
    })
    .then(res => res.body);
};


describe('tweets app', () => {

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('creates a new tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'ladybeard',
        text: 'I\'m writing a book on PHIL-osophy'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'ladybeard',
          text: 'I\'m writing a book on PHIL-osophy',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('finds tweet by id', () => {
    return makeTweet('Hello, you know')
      .then(createdTweet => {
        return request(app)
          .get(`/tweets/${createdTweet._id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: 'ladybeard',
              text: 'Hello, you know',
              _id: expect.any(String),
              __v: 0
            });
          });
      });
  });

  it('finds by id and update', () => {
    return makeTweet('Soooo')
      .then(createdTweet => {
        return Promise.all([
          Promise.resolve(createdTweet._id),
          request(app)
            .patch(`/tweets/${createdTweet._id}`)
            .send({ text: 'HOOOJ' })
        ]);
      })
      .then(([_id, res]) => {
        return request(app)
          .get(`/tweets/${_id}`)
          .then((res => {
            expect(res.body.text).toEqual('HOOOJ');
          }));
      });
  });

  it('returns a list of tweets', () => {
    return Promise.all(['I heart Squirrels', 'Sardine Saturday is my fave!'].map(tweet => {
      makeTweet(tweet);
    }))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(2);
      });
  });

});
