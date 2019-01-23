/* eslint-disable no-console*/

require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const app = require('../lib/app');
const request = require('supertest');
const Tweet = require('../lib/models/Tweet');

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
  const createTweet = (handle = 'ladybeard', text = 'I heart Squirrels') => {
    return Tweet.create({ handle, text });
  };

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
      .then(([_id]) => {
        return request(app)
          .get(`/tweets/${_id}`)
          .then((res => {
            expect(res.body.text).toEqual('HOOOJ');
          }));
      });
  });

  it('returns a list of tweets', () => {
    return Promise.all(['I heart Squirrels', 'Sardine Saturday is my fave!'].map(createTweet))
      .then(createdTweets => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('deletes a tweet by id', () => {
    return makeTweet('oops')
      .then(oopsTweet => {
        console.log('OOPS', oopsTweet);
        return request(app)
          .delete(`/tweets/${oopsTweet._id}`);
      })
      .then((res => {
        console.log('test side res.body:', res.body);
        expect(res.body).toEqual({ deleted: 1 });
      }));
  });

});
