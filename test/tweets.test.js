require('../lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');

let tweet = null;
let user = null;
describe('them tweets', () => {
  const createUser = (handle, name, email) => {
    return User.create({ handle, name, email })
      .then(user => ({ ...user, _id: user._id.toString() }));
  };

  const createTweet = (handle, text = 'I is a twit') => {
    return createUser(handle, 'shabz', 'shabz@shabz.com')
      .then(userRes => {
        user = userRes;
        return Tweet.create({ handle: user._id, text })
          .then(tweetRes => ({ ...tweetRes, _id: tweetRes._id.toString() }));
      });
  };

  beforeEach(done => mongoose.connection.dropDatabase(() => done()));

  beforeEach(done => {
    createTweet('shabz')
      .then(res => {
        const { _id, handle, text } = res;
        tweet = { _id, handle, text };
        done();
      });
  });

  afterAll(() => mongoose.disconnect());

  it.only('posts a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: user._id,
        text: 'I am still a twit'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: expect.any(String),
          text: 'I am still a twit',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('gets list of all tweets', () => {
    return request(app)
      .get('/tweets')
      .then(res => {
        expect(res.body).toHaveLength(1);
      });
  });

  it('gets a tweet by id', () => {
    return request(app)
      .get(`/tweets/${tweet._id}`)
      .then(res => expect(res.body).toEqual({
        handle: 'shabz',
        text: 'I is a twit',
        _id: expect.any(String)
      }));
  });

  it('errors when bad id is sent', () => {
    return request(app)
      .get('/tweets/5')
      .then(res => expect(res.status).toEqual(500));
  });

  it('updates through patch', () => {
    return request(app)
      .patch(`/tweets/${tweet._id}`)
      .send({
        handle: tweet.handle,
        text: 'I meant tweet'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: tweet._id,
          handle: 'shabz',
          text: 'I meant tweet'
        });
      });
  });

  it('deletes tweet by id', () => {
    return request(app)
      .delete(`/tweets/${tweet._id}`)
      .then(res => expect(res.body).toEqual({ deleted: 1 }));
  });
});
