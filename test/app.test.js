require('dotenv').config();
require('../connect')();
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

  const createTweet = (handle, text = 'some text') => {
    return createUser(handle, 'drew', 'drewvv@gmail.com')
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
    return createUser('mac', 'drew', 'drewvv@gmail.com')
      .then(user => {
        return request(app)
          .post('/tweets')
          .send({
            handle: user._id,
            text: 'some text'
          })
          .then(res => {
            expect(res.body).toEqual({
              handle: expect.any(String),
              text: 'some text',
              _id: expect.any(String),
              __v: 0
            });
          });
      });
  });

  it('gets a list of tweets', () => {
    return createUser('mac', 'drew', 'drewvv@gmail.com')
      .then(user => {
        return Promise.all([user._id, user._id].map(createTweet))
          .then(() => {
            return request(app)
              .get('/tweets');
          })
          .then(res => {
            expect(res.body).toHaveLength(2);
          });
      });
  });
  it('gets a tweet by id', () => {
    return createTweet('some text')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .get(`/tweets/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: expect.any(Object),
              text: 'some text',
              _id,
              __v: 0
            });
          });
      });
  });
  it('updates a tweet by id', () => {
    return createTweet('not updated')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .patch(`/tweets/${_id}`)
          .send({ ...createdTweet, text: 'updated' });
      })
      .then(res => {
        expect(res.body.text).toEqual('updated');
      });
  });
  it('deletes a tweet by id', () => {
    return createTweet('my tweet')
      .then(createdTweet => {
        return request(app)
          .delete(`/tweets/${createdTweet._id}`);
      })
      .then(res => {
        expect(res.text).toEqual('deleted: true');
      });
  });
});
