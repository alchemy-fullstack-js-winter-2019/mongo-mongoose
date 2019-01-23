require('../lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');

// let tweet = null;
describe('them tweets', () => {
  const createTweet = (handle, text = 'I is a twit') => Tweet.create({ handle, text });

  beforeEach(done => mongoose.connection.dropDatabase(() => done()));

  beforeEach(done => {
    createTweet('shabz')
      .then(() => {
        // const { _id, __v, handle, text } = res;
        // tweet = { _id, __v, handle, text };
        done();
      });
  });

  afterAll(() => mongoose.disconnect());

  it('gets tweets', () => {
    return request(app)
      .get('/tweets')
      .then(res => {
        expect(res.body).toEqual([
          {
            handle: 'shabz',
            text: 'I is a twit',
            _id: expect.any(String),
            __v: 0
          }
        ]);
      });
  });
});
