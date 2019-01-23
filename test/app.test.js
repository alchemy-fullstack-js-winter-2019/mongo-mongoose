require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const request = require('supertest');
const mongoose = require('mongoose');

const createTweet = handle => {
  return request(app)
    .post('/tweets')
    .send({
      handle: handle,
      text: 'my tweeter tweets'
    })
    .then(res => res.body);
};

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('creates a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({ handle: 'TA', text: 'my first tweet' })
      .then(res => {
        expect(res.body).toEqual({ 
          handle: 'TA',
          text: 'my first tweet',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
  
  it('gets a list of tweets', () => {
    const handles = ['TA1', 'TA2', 'TA3'];
    return Promise.all(handles.map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets')
          .then(res => {
            expect(res.body).toHaveLength(3);
          });
      });
  });

  it('finds by id', () => {
    return createTweet('TT')
      .then(createdTweet => {
        const id = createdTweet._id;
        return request(app)
          .get(`/tweets/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'TT',
          text: 'my tweeter tweets',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
 
  it('updates a tweet', () => {
    return createTweet('TeeTee')
      .then(createdTweet => {
        const id = createdTweet._id;
        return request(app)
          .patch(`/tweets/${id}`)
          .send({
            handle: 'TeeTee',
            text: 'updated tweet',
            _id: id,
            __v: 0
          })
          .then(() => {
            return request(app)
              .get(`/tweets/${id}`)
              .then(res => {
                expect(res.body).toEqual({
                  handle: 'TeeTee',
                  text: 'updated tweet',
                  _id: id,
                  __v: 0
                });
              });
          });
      });
  });

  it('deletes a tweet by id', () => {
    return createTweet('deleted')
      .then(createdTweet => {
        return request(app)
          .delete(`/tweets/${createdTweet._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ 
          handle: 'deleted',
          text: 'my tweeter tweets',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

});

