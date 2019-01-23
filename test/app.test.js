require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');
const Tweet = require('../lib/models/Tweet');

describe('tweets app', () => {
  const createTweet = (handle, text = 'a tweet') => {
    return Tweet.create({ handle, text });
  };

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('creates a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({ handle: 'carmen', text: 'my first tweet' })
      .then(res => {
        
        expect(res.body).toEqual({
          handle: 'carmen', text: 'my first tweet', _id: expect.any(String),
          __v: 0 
        });
      }); 
  });

  it('finds a list of tweets', () => {
    return Promise.all(['carmen', 'another handle'].map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('gets a tweet by id', () => {
    return createTweet('carmen')
      .then(createdTweet => {
        return Promise.all([
          Promise.resolve(createdTweet._id),
          request(app)
            .get(`/tweets/${createdTweet._id}`)
        ]);
      })
      // eslint-disable-next-line no-unused-vars
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          handle: 'carmen',
          text: 'a tweet',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('errors when a bad id is sent', () => {
    return request(app)
      .get('/5c479e5d22e69952c13506a8')   
      .then(res => {
        expect(res.status).toEqual(404);
      });
  });

  it('gets tweet by id and return an updated tweet', () => {
    const updatedTweet = {
      handle: 'carmen1',
      text: 'God is good all the time!'
    };
    return createTweet('helloworld')
      .then(tweetCreated => {
        const _id = tweetCreated._id;
        return request(app)
          .put(`/tweets/${_id}`)
          .send(updatedTweet);
      })
      .then(res => {
        expect(res.body.handle).toEqual('carmen1');
      });
  });

});


