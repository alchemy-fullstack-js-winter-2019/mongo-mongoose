require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');

describe('Tweets app', () => {
  const createTweet = (handle, text = 'tweet') => {
    return Tweet.create({ handle, text })
  }
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  })
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
    .then(createdTweets => {
      return request(app)
        .get('/tweets');
    })
    .then(res => {
      expect(res.body).toHaveLength(2);
    });
  });


  //   return request(app)
  //     .get('/tweets')
  // })
});

