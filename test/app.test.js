require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');
const Tweet = require('../lib/models/Tweet');

const createTweet = (handle, text = 'oink tweet moo') => {
  return Tweet.create({ handle, text });
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
      .then(res => {
        expect(res.body).toHaveLength(3);
      });
  });

  it('can post a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({ handle: 'yogurt', text: 'greek or nah?' })
      .then(res => {
        expect(res.body).toEqual({ 
          __v: 0, 
          _id: expect.any(String), 
          handle: 'yogurt', 
          text: 'greek or nah?' 
        });
      });
  });

  it('can get a tweet by its id', () => {
    return createTweet('shezza')
      .then(res => {
        return request(app)
          .get(`/tweets/${res._id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: 'shezza',
              text: 'oink tweet moo',
              __v: 0,
              _id: expect.any(String)
            });
          });
      });
  });

  // it('can update a tweet', () => {
  //   let newTweet = { text: 'ele-FANT-eh' };
  //   return createTweet('ele4ant3')
  //     .then(res => {
  //       return request(app)
  //         .patch(`/tweet/${res._id}`)
  //         .send(newTweet);
  //     })
  //     .then(res => {
  //       expect(res.body).toEqual({ 
  //         handle: 'ele4ant3', 
  //         text: 'ele-FANT-eh', 
  //         _id: expect.any(String),
  //         __v: 0
  //       });
  //     });
  // });

  it('can delete a tweet', () => {
    return createTweet('m3m3lord')
      .then(res => {
        return request(app)
          .delete(`/tweets/${res._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ 
          handle: 'm3m3lord',
          text: 'oink tweet moo',
          __v: 0,
          _id: expect.any(String)
        });
      });
  });
});
