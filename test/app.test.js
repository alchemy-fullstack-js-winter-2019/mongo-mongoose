require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');


describe('Tweets app', () => {
  const createUser = (handle, name, email) => { //creates a user
    return User.create({ handle, name, email }) //returns a user to conver id
      .then(user => ({ ...user, _id: user._id.toString() })); //converts this id to user
  };
  
  const createTweet = (handle, text = 'a tweet') => {
    return createUser(handle, 'ron', 'ryan@yahoo.com')
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
  it('Create a new tweet', () => {
    return createUser('ron', 'ray23', 'ryan@yahoo.com')
      .then(user => {
        return request(app) 
          .post('/tweets') 
          .send({ 
            handle: user._id, 
            text: 'It is sunny'
          })
          .then(res => { 
            expect(res.body).toEqual({ 
              handle: expect.any(String), 
              text: 'It is sunny', 
              _id: expect.any(String), 
              __v: 0 
            });
          });
      });
  });
  it('finds a list of tweets', () => {
    return Promise.all(['bumblebee', 'flower'].map(createTweet)) //will wait until all mapped
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });
  it('finds a tweet by id', () => {
    return createTweet('ron')
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
        });
      });
  });
  it('will find by id and update', () => {
    const updatedTweet = {
      text: 'a tweet'
    };
    return createTweet('ron')
      .then(createdTweet => {
        const id = createdTweet._id;
        return request(app)
          .patch(`/tweets/${id}`)
          .send(updatedTweet);
      })
      .then((res) => {
        expect(res.body).toEqual({
          handle: expect.objectContaining({ handle: 'ron' }),
          text: 'a tweet',
          _id: expect.any(String),       
        });
      });
  });
  it('will delete tweet by id and return delete count', () => {
    return createTweet('Tweet')
      .then(tweet => {
        return request(app)
          .delete(`/tweets/${tweet._id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });
});

describe('User app', () => {
  const createUser = (handle, name, email = 'a user') => {
    return User.create({
      handle, 
      name,
      email 
    });
  };
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  it('create a user', () => {
    return request(app)
      .post('/users')
      .send({
        handle: 'PDX34',
        name: 'John',
        email: 'pdx34J@gmail.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'PDX34',
          name: 'John',
          email: 'pdx34J@gmail.com',
          _id: expect.any(String),
          __v: 0 
        });
      });
  });
  it('gets users', () => {
    return Promise.all(['bumblee', 'flower'].map(createUser))
      .then(() => {
        return request(app)
          .get('/users');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('find user by id', () => {
    return createUser('user234', 'Don', 'don234@yahoo.com')
      .then((createdUser) => {
        const id = createdUser._id;
        return request(app)
          .get(`/users/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'user234',
          name: 'Don',
          email: 'don234@yahoo.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  it('find user by id and update', () => {
    const updatedUser = {
      handle: 'Don233',
      name: 'Don',
      email: 'don233@yahoo.com'
    };
    return createUser('Usertypo')
      .then(createdUser => {
        const id = createdUser._id;
        return request(app)
          .patch(`/users/${id}`)
          .send(updatedUser);
      })
      .then(res => {
        expect(res.body.handle).toEqual('Don233');
      });
  });

  it('will delete a user', () => {
    return createUser('User')
      .then(user => {
        return request(app)
          .delete(`/users/${user._id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });
  afterAll(() => {
    return mongoose.disconnect();
  });
});
