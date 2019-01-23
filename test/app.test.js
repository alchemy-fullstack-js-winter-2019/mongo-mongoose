require('dotenv').config();
require('../lib/utils/connect')();

const app = ('../lib/app');
const mongoose = require('mongoose');
const request = request('supertest');
const Tweet = require('../lib/models/Tweet');

describe('tweets app', () => {
  const createTweet = (handle, text = 'tweet') => {
    return Tweet.create({ handle, text });
  };

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done(); 
    });
  });

  it('can create a new tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'jei',
        text: 'hello'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle : 'jei',
          text: 'hello',
          _id: expect.amy(String),
          __v: 0
        });
      });
  });
  it('can get by id', () => {
    return createTweet('hey')
      .then(createdTweet => {
        return Promise.all([
          Promise.resolve(createdTweet._id),
          request(app)
            .get(`/tweets/${createdTweet._id}`)
        ]);
      })
      .then(([_id, res])=> {
        expect(res.body).toEqual({
          handle: 'hey there',
          text: 'a tweet',
          _id,
          __v: 0
        });
      });
  });

  it('finds a list of tweets', () => {
    return Promise.all(['jei', 'jz'].map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('can find by id and delete', () => {
    return createTweet('hey')
      .then(createdTweet => {
        return request(app)
          .delete(`/tweets/${createdTweet._id}`);
      })
      .then(res => {
        expect(res.text).toEqual('deleted: true');
      });
  });

  it('sends error for bad id', () => {
    return request(app)
      .get('/tweets/24590u4n0f')
      .then(res => {
        expect(res.status).toEqual(404);
      });
  });
});
