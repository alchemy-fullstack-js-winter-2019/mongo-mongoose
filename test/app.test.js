require('dotenv').config();
require('../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../lib/app');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');

beforeEach(done => {
  return mongoose.connection.dropDatabase(() => {
    done();
  });
});


describe('tweets app', () => {
  const createTweet = (handle, text = 'a tweet') => {
    return Tweet.create({ handle, text });
  };

  it('creates a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({ handle: 'carmen', text: 'my first tweet' })
      .then(res => {
        
        expect(res.body).toEqual({
          handle: 'carmen', text: 'my first tweet', _id: expect.any(String),
          __v: 0 
        });
      }); 
  });

  it('finds a list of tweets', () => {
    return Promise.all(['carmen', 'another handle'].map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('gets a tweet by id', () => {
    return createTweet('carmen')
      .then(createdTweet => {
        return Promise.all([
          Promise.resolve(createdTweet._id),
          request(app)
            .get(`/tweets/${createdTweet._id}`)
        ]);
      })
      // eslint-disable-next-line no-unused-vars
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          handle: 'carmen',
          text: 'a tweet',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('errors when a bad id is sent', () => {
    return request(app)
      .get('/5c479e5d22e69952c13506a8')   
      .then(res => {
        expect(res.status).toEqual(404);
      });
  });

  it('gets tweet by id and return an updated tweet', () => {
    const updatedTweet = {
      handle: 'carmen1',
      text: 'God is good all the time!'
    };
    return createTweet('helloworld')
      .then(tweetCreated => {
        const _id = tweetCreated._id;
        return request(app)
          .patch(`/tweets/${_id}`)
          .send(updatedTweet);
      })
      .then(res => {
        expect(res.body.handle).toEqual('carmen1');
      });
  });

  it('gets a tweet by :id, delete, and return the delete count', () => {
    return createTweet('Mabuhay')
      .then(tweetCreated => {
        const _id = tweetCreated._id;
        return request(app)
          .delete(`/tweets/${_id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });

});

describe('users app', () => {

  const createUser = (handle, name = 'carmen', email = 'carmen@email.com') => {
    const userCreated = User.create({ handle, name, email });
    console.log('User created', userCreated);
    return userCreated;
  };
  
  it('creates a user', () => {
    return request(app)
      .post('/users')
      .send({ handle: 'fruitlady', name: 'carmen', email: 'carmen@email.com' })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'fruitlady', 
          name: 'carmen', 
          email: 'carmen@email.com', 
          _id: expect.any(String), 
          __v: 0 
        });
      }); 
  });

  it('finds a list of users', () => {
    return Promise.all(
      ['user1', 'user2', 'user3'].map(createUser))
      .then(() => {
        return request(app)
          .get('/users');
      })
      .then(res => {
        expect(res.body).toHaveLength(3);
      });
  });

  it('gets a user by id', () => {
    return createUser('fruitlady')
      .then(createdUser => {
        return Promise.all([
          Promise.resolve(createdUser._id),
          request(app)
            .get(`/tweets/${createdUser._id}`)
        ]);
      })
      // eslint-disable-next-line no-unused-vars
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          handle: 'fruitlady',
          name: 'carmen',
          email: 'carmen@email.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

});
