require('dotenv').config();
require('../lib/utils/connect')();

const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');

describe('tweets app', () => {

  const createTweet = (handle, text = 'tweet!') => {
    return request(app)
      .post('/tweets')
      .send({ handle, text })
      .then(res => res.body);
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
        handle: 'ivan',
        text: 'Hello World',
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'ivan',
          text: 'Hello World',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('gets a list of tweets', () => {
    return Promise.all(['yo!', 'hi!', 'bye felicia!'].map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(3);
      });
  });

  it('gets a tweet by id', () => {
    return createTweet('ivan')
      .then(createdTweet => {
        return Promise.all([
          Promise.resolve(createdTweet._id), 
          request(app)
            .get(`/tweets/${createdTweet._id}`)
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          text: 'tweet!',
          handle: 'ivan',
          _id,
          __v: 0
        });
      });
  });

  it('can find a tweet by id and update', () => {
    return createTweet('tweety')
      .then(createdTweet => {
        const id = createdTweet._id;
        return request(app)
          .patch(`/tweets/${id}`)
          .send({ ...createdTweet, text: 'tweet!' });
      })
      .then(res => {  
        expect(res.body.text).toEqual('tweet!');
      });
  });

  it('can find by id and delete', () => {
    return createTweet('tweet!')
      .then(createdTweet => {
        return request(app)
          .delete(`/tweets/${createdTweet._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ deleted: 1 });
      });
  });
});


describe('users app', () => {

  const createUser = (handle = 'ballislife', name = 'ivan', email = 'ivan@espn.com') => {
    return request(app)
      .post('/users')
      .send({ handle, name, email })
      .then(res => res.body);
  };

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('can create a new user', () => {
    return request(app)
      .post('/users')
      .send({
        handle: 'ballislife',
        name: 'ivan',
        email: 'ivan@espn.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'ballislife',
          name: 'ivan',
          email: 'ivan@espn.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('gets a list of users', () => {
    return Promise.all(['user', 'user2', 'user3'].map(createUser))
      .then(() => {
        return request(app)
          .get('/users');
      })
      .then(res => {
        expect(res.body).toHaveLength(3);
      });
  });

  it('gets a user by id', () => {
    return createUser('ballislife')
      .then(createdUser => {
        return Promise.all([
          Promise.resolve(createdUser._id),
          request(app)
            .get(`/users/${createdUser._id}`)
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          email: 'ivan@espn.com',
          name: 'ivan',
          handle: 'ballislife',
          _id,
          __v: 0
        });
      });
  });

  it('can find a tweet by id and update', () => {
    return createUser('ivann')
      .then(createdUser => {
        const id = createdUser._id;
        return request(app)
          .patch(`/users/${id}`)
          .send({ ...createdUser, text: 'ivan' });
      })
      .then(res => {  
        expect(res.body.name).toEqual('ivan');
      });
  });
});
