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
});
