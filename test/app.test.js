require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');

const createTweets = (handle, text = 'Hello') => {
  return request(app)
    .post('/tweets')
    .send({
      handle,
      text
    })
    .then(res => res.body);
};

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  
  it('can create a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'Aaron',
        text: 'Hello World'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'Aaron',
          text: 'Hello World',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('gets a list of all tweets', () => {
    const tweetsToCreate = ['Hola', 'Hola2', 'Hola3', 'Hola4', 'Hola5'];
    return Promise.all(tweetsToCreate.map(createTweets))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(5);
      });
  });

  it('gets a tweet', () => {
    return request(app)
      .get('/tweets/abcd')
      .then(res => {
        expect(res.text).toEqual('abcd');
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
          .delete(`/tweets/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ 'deleted': 1 });
      });
  });

});
