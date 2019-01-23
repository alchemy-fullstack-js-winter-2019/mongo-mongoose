require('../lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');

let tweet = null;
describe('them tweets', () => {
  const createTweet = (handle, text = 'I is a twit') => Tweet.create({ handle, text });

  beforeEach(done => mongoose.connection.dropDatabase(() => done()));

  beforeEach(done => {
    createTweet('shabz')
      .then(res => {
        const { _id, __v, handle, text } = res;
        tweet = { _id, __v, handle, text };
        done();
      });
  });

  it('posts a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'shabz2',
        text: 'I am also a twit'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'shabz2',
          text: 'I am also a twit',
          __v: 0,
          _id: expect.any(String)
        });
      });
  });

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

  it('gets a tweet by id', () => {
    return request(app)
      .get(`/tweets/${tweet._id}`)
      .then(res => expect(res.body).toEqual({
        handle: 'shabz',
        text: 'I is a twit',
        _id: expect.any(String),
        __v: 0
      }));
  });

  it('errors when bad id is sent', () => {
    return request(app)
      .get('/tweets/5')
      .then(res => expect(res.status).toEqual(500));
  });

  afterAll(() => mongoose.disconnect());
});
