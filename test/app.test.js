const request = require('supertest');
require('dotenv').config();//module for configuration
require('../lib/utils/connect')();//connects to db
const app = require('../lib/app.js');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');

//why did we have to use:
//return request(app) in the express lab?
const createTweet = (handle, text = 'this is a sample tweet') => {
  return Tweet.create({ handle, text });
};

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  it('creates a tweet', ()=> {
    return request(app)
      .post('/tweets')
      .send({ handle: 'johnny', text: 'My first tweet to mongo db' })
      .then(res => {
        expect(res.body).toEqual({ 
          handle: 'johnny', 
          text: 'My first tweet to mongo db',
          _id: expect.any(String),
          __v: 0 }); 
      });
  });
  it('gets a tweet by id', () => {
    return createTweet('mine')
      .then(createdTweet => {
        return Promise.all([
          Promise.resolve(createdTweet._id),
          request(app)
            .get(`/tweets/${createdTweet._id}`)
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          handle: 'mine',
          text: 'this is a sample tweet',
          _id,
          __v: 0
        });
      });
  });
  it('gets a list of tweets', ()=> {
    //use promaise all to imply createTweet function
    return Promise.all(['tweet 1', 'tweet 2', 'tweet 3'].map(createTweet))
    //why is it okay for createdTweets to go uncalled?
      // eslint-disable-next-line no-unused-vars
      .then(createdTweets => {
        return request(app)
          .get('/tweets');
      })
      .then(res=> {
        expect(res.body).toHaveLength(3);
      });

  });

});
