const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');
require('dotenv').config();
require('../lib/utils/connect')();

const createTweet = (handle) => {
  return request(app)
    .post('/tweets')
    .send({
      handle,
      text: 'oink tweet moo'
    })
    .then(res => res.body);
};

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  it('can get a list of tweets from our db', () => {
    const tweetsToCreate = ['yoyo', 'jelly123', 'jessie456'];
    return Promise.all(tweetsToCreate.map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(3);
      });
  });
  // it('can post a tweet', () => {
  //   return request(app)
  //     .post('/tweets')
  //     .send({ handle: 'yogurt', text: 'greek or nah?' })
  //     .then(res => {
  //       expect(res.body).toEqual({ _v: expect.any(Number), _id: expect.any(String), handle: 'yogurt', text: 'greek or nah?' });
  //     });
  // });
});
