require('dotenv').config();
require('../connect')();
const app = require('../lib/app');
const mongoose = require('mongoose');
const request = require('supertest');

const createTweet = (handle) => {
  return request(app)
    .post('/tweets')
    .send({
      handle,
      text: 'my first tweet'
    })
    .then(res => res.body);
};

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  it('can create a new tweet', () => {
    return request(app)
    .post('/tweets')
    .send({
      handle: 'drew',
      text: 'some text'
    })
    .then(res => {
      expect(res.body).toEqual({
        handle: 'drew',
        text: 'some text',
        _id: expect.any(String),
        __v: 0
      });
    });
  });
  it('gets a list of tweets', () => {
    return Promise.all(['drew', 'another handle'].map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets')
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });
  it('gets a tweet by id', () => {
    return createTweet('some text')
    .then(createdTweet => {
      const _id = createdTweet._id;
      return request(app)
      .get(`/tweets/${_id}`)
      .then(res => {
      expect(res.body).toEqual({
        handle: 'some text',
        text: 'my first tweet',
        _id,
        __v: 0
      });
    });
  });
});
    it('updates a tweet by id', () => {
      return createTweet('not updated')
        .then(createdTweet => {
          const _id = createdTweet._id;
          return request(app)
          .patch(`/tweets/${_id}`)
          .send({ ...createdTweet, text: 'updated' });
        })
          .then(res => {
          expect(res.body.text).toEqual('updated');
        });
    });
    it('deletes a tweet by id', () => {
      return createTweet('my tweet')
        .then(createdTweet => {
          return request(app)
            .delete(`/tweets/${createdTweet._id}`);
        })
        .then(res => {
          expect(res.text).toEqual('deleted: true');
        });
    });
});
