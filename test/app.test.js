require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');

describe('Tweets app', () => {
  const createTweet = (handle, text = 'tweet') => {
    return Tweet.create({
      handle, 
      text 
    });
  };
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  it('Create a new tweet', () => {
    return request(app) //make a request to our app
      .post('/tweets') //post to tweets
      .send({ //user is sending to server
        handle: 'Tweeter23',
        text: 'It is sunny'
      })
      .then(res => { //we expect the response.body
        expect(res.body).toEqual({ handle: 'Tweeter23', text: 'It is sunny', _id: expect.any(String), __v: 0 });
      });
  });
  it('finds a list of tweets', () => {
    return Promise.all(['bumblebee', 'flower'].map(createTweet)) //will wait until all mapped
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });
  it('finds a tweet by id', () => {
    return createTweet('tweet 1', 'It is sunny')
      .then((createdTweet) => {
        const id = createdTweet._id;
        return request(app)
          .get(`/tweets/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'tweet 1',
          text: 'It is sunny',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
  it('will find by id and update', () => {
    const updatedTweet = {
      handle: 'Tweet24',
      text: 'Sunny'
    };
    return createTweet('TweetTypo')
      .then(createdTweet => {
        const id = createdTweet._id;
        return request(app)
          .patch(`/tweets/${id}`)
          .send(updatedTweet);
      })
      .then(res => {
        expect(res.body.handle).toEqual('Tweet24');
      });
  });
  it('will delete tweet by id and return delete count', () => {
    return createTweet('Tweet')
      .then(tweet => {
        return request(app)
          .delete(`/tweets/${tweet._id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });

});

