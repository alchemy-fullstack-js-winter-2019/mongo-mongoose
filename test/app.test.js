/* eslint-disable no-unused-vars */
const request = require('supertest');
require('dotenv').config();//module for configuration
require('../lib/utils/connect')();//connects to db
const app = require('../lib/app.js');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/Users');
//whats the difference between res.body // res.text 
//why did we have to use:
//return request(app) in the express lab?

//linking user and tweet.
//we need a user to create a tweet.
//handle is a reference to a user. 

describe('tweets app', () => {
  const createUser = (handle, name, email) => {
    return User.create({ handle, name, email })
    //takes everything in user, then tagetes id to stringify
      .then(user => ({ ...user, _id: user._id.toString() }));
  };


  const createTweet = (handle, text = 'a tweet') => {
    // create user first
    return createUser(handle, 'ryan', 'ryan@email.com')
      .then(user => {
        //we pass user._id bc be care linking tweet to user with id.
        return Tweet.create({ handle: user._id, text })
          .then(tweet => ({ ...tweet, _id: tweet._id.toString() }));
      });

  };
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  it('can create a new tweet', () => {
    return createUser('ryan', 'ryan', 'ryan@ryan.com')
      .then(user => {
        return request(app)
          .post('/tweets')
          .send({
            handle: user._id,
            text: 'hello tweets'
          })
          .then(res => {
            expect(res.body).toEqual({
              handle: expect.any(String),
              text: 'hello tweets',
              _id: expect.any(String),
              __v: 0
            });
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
  it('gets a tweet by id', () => {
    return createTweet('ryan')
      .then(createdTweet => {
        return Promise.all([
          Promise.resolve(createdTweet._id),
          request(app)
            .get(`/tweets/${createdTweet._id}`)
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          //expect any object bc handle contains several properties. 
          handle: expect.any(Object),
          text: 'a tweet',
          _id: expect.any(String)
        });
      });
  });
  it('updates tweet by id', ()=> {
    return createTweet('this is a tweet', 'more', 'another')
      .then(createdTweet => {
        return Promise.all([
          Promise.resolve(createdTweet._id),
          request(app)
            .patch(`/tweets/${createdTweet._id}`)
            .send({ text: 'newTweet' })
        ])
          .then(([_id, res]) => {
            expect(res.body.text).toEqual('newTweet');

          });
      });
  });

  it('finds by id and deletes', ()=> {
    return createTweet('delete this')
      .then(tweet2Delete => {
        return request(app)
          .delete(`/tweets/${tweet2Delete._id}`)
          .send({ deleted: 1 });
      })
      .then(res => {
        expect(res.body).toEqual({ deleted: 1 });
        
      });
  });

});
