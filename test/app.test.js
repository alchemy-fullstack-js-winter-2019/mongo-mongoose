require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../lib/app');

const createTweet = (handle, text = 'hi I a tweet') => {
  return request(app)
    .post('/tweets')
    .send({
      handle,
      text
    })
    .then(res => res.body);
};

describe('tweets app', () => {
  beforeEach(done => {
    // createTweet();
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

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

  it('can create a new tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'cari',
        text: 'hiya tweety'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'cari',
          text: 'hiya tweety',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  // GET by id
  it('can get a tweet by id', () => {
    return createTweet('hayyyyyy')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .get(`/tweets/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: 'hayyyyyy',
              text: 'hi I a tweet',
              _id,
              __v: 0
            });
          });
      });
  });

  // PUT method replaces entire object (overwrites)
  // PATCH method replaces single entity in object
  // PATCH ------------------------------------------
  it.skip('can retrieve a tweet by :id and return the updated tweet', () => {
    let newTweet = {
      handle: 'pizzatown',
      text: 'can you believe this *&#(*@???'
    };
    return createTweet('pizzatown')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .patch(`/tweets/${_id}`)
          .send(newTweet);
      })
      .then(res => {
        expect(res.body.text).toEqual('can you believe this *&#(*@???');
      });
  });

  // DELETE ------------------------------------------
  it('can retrieve a tweet by :id, delete, and return the delete count', () => {
    return createTweet('alo')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .delete(`/tweets/${_id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });
});
