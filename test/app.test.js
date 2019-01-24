require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');

const createTweets = (handle, text = 'Hello') => {
  return createUsers(handle)
    .then(createUsers => {
      return request(app)
        .post('/tweets')
        .send({
          handle: createUsers._id,
          text
        })
        .then(res => res.body);
    });
};

const createUsers = (handle, name = 'Aaron', email = 'AMDennis1987@gmail.com') => {
  return request(app)
    .post('/users')
    .send({
      handle,
      name,
      email
    })
    .then(res => res.body);
};

jest.mock('../lib/services/ronSwansonApi');

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('can create a tweet', () => {
    return createUsers('test user')
      .then(createdUser => {
        return request(app)
          .post('/tweets')
          .send({
            handle: createdUser._id,
            text: 'Hello World'
          })
          .then(res => {
            expect(res.body).toEqual({
              handle: expect.any(String),
              text: 'Hello World',
              _id: expect.any(String),
              __v: 0
            });
          });

      });
  });

  it('can create a tweet with random quote', () => {
    return createUsers('test user')
      .then(createdUser => {
        return request(app)
          .post('/tweets?random=true')
          .send({
            handle: createdUser._id,
            text: 'Hello World'
          })
          .then(res => {
            expect(res.body).toEqual({
              handle: expect.any(String),
              text: '"Crying: acceptable at funerals and the Grand Canyon."',
              _id: expect.any(String),
              __v: 0
            });
          });

      });
  });

  it('gets a list of all tweets', () => {
    const tweetsToCreate = ['Hola', 'Hola2'];
    return Promise.all(tweetsToCreate.map(createTweets))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(2);
      });
  });

  it('gets a single tweet by id', () => {
    return createTweets('Aaron')
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
          text: 'Hello',
          _id
        });
      });
  });

  it('finds a tweet by id and updates it', () => {
    return createTweets('Peter')
      .then(updatedTweet => {
        updatedTweet.handle = 'Peter2';
        return request(app)
          .patch(`/tweets/${updatedTweet._id}`)
          .send(updatedTweet);
      })
      .then(res => {
        expect(res.text).toContain('Peter2');
      });
  });

  it('finds by id and deletes object', () => {
    return createTweets('Peter')
      .then(createdTweets => {
        const id = createdTweets._id;
        return request(app)
          .delete(`/tweets/${id}`)
          .then(res => {
            expect(res.body).toEqual({ 'deleted': 1 });
          });
      });
  });
});
