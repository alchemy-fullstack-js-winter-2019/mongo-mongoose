require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const mongoose = require('mongoose');
const request = require('supertest');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');


describe('tweets app', () => {
  
  const createUser = (handle, name, email) => {
    return User.create({ handle, name, email })
      .then(user => ({ ...user, _id: user._id.toString() }));
  };

  const createTweet = (handle, text = 'a tweet') => {
    return createUser(handle, 'ryan', 'ryan@email.com')
      .then(user => {
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
            text: 'hello tweets',
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

  it('finds a list of tweets', () => {
    return Promise.all(['ryan', 'another handle'].map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('gets a tweet by id', () => {
    return createTweet('Connor')
      .then(createdTweet => {
        return Promise.all([
          Promise.resolve(createdTweet._id),
          request(app)
            .get(`/tweets/${createdTweet._id}`)
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          handle: expect.any(Object),
          text: 'a tweet',
          _id,
          __v: 0
        });
      });

    //   const _id = createdTweet._id;
    //   return request(app)
    //     .get(`/tweets/${_id}`)
    //     .then(res => {
    //       expect(res.body).toEqual({
    //         handle: 'Connor',
    //         text: 'my first tweet',
    //         _id,
    //         __v: 0
    //       });
    //     });
    // });
  });

  it('errors when a bad id is sent', () => {
    return request(app)
      .get('/tweets/5c479e5d22e69952c13506a8')
      .then(res => {
        expect(res.status).toEqual(404);
      });
  });

  it('updates a tweet by id', () => {
    return createTweet('connor')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .patch(`/tweets/${_id}`)
          .send({
            text: 'updated tweet'
          })
          .then(res => {
            expect(res.body).toEqual({
              handle: expect.any(Object),
              text: 'updated tweet',
              _id,
              __v: 0
            });
          });
      });
  });

  it('deletes a tweet by id', () => {
    return createTweet('Cool Dude')
      .then(createdTweet => {
        return Promise.all([
          Promise.resolve(createdTweet._id),
          request(app)
            .delete(`/tweets/${createdTweet._id}`)
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          handle: expect.any(String),
          text: 'a tweet',
          _id,
          __v: 0
        });
        return request(app)
          .get(`/tweets/${_id}`);
      })
      .then(res => {
        expect(res.status).toEqual(404);
      });

    // const _id = createdTweet._id;
    // return request(app)
    //   .delete(`/tweets/${_id}`)
    //   .then(res => {
    //     expect(res.body).toEqual({
    //       handle: 'Cool Dude',
    //       text: 'my first tweet',
    //       _id,
    //       __v: 0
    //     });
    //   });
  });
});