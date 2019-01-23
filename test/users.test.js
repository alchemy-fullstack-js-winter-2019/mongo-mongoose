require('../lib/utils/connect')('mongodb://127.0.0.1:27017/users');
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

let user = null;
describe('them users', () => {
  const createUser = (handle, name = 'Shaba R', email = 'shaba@shabster.com') => User.create({ handle, name, email });

  beforeEach(done => mongoose.connection.dropDatabase(() => done()));

  beforeEach(done => {
    createUser('shabz')
      .then(res => {
        const { _id, __v, handle, name, email } = res;
        user = { _id: _id.toString(), __v, handle, name, email };
        done();
      });
  });

  afterAll(() => mongoose.disconnect());

  it('posts a user', () => {
    return request(app)
      .post('/users')
      .send({
        handle: 'shabz2',
        name: 'Shady',
        email: 'shady@shadester.com'
      })
      .then(res => expect(res.body).toEqual({
        handle: 'shabz2',
        name: 'Shady',
        email: 'shady@shadester.com',
        _id: expect.any(String),
        __v: 0
      }));
  });

  it('gets list of all users', () => {
    return request(app)
      .get('/users')
      .then(res => expect(res.body).toEqual([user]));
  });

  it('gets user by id', () => {
    return request(app)
      .get(`/users/${user._id}`)
      .then(res => expect(res.body).toEqual(user));
  });

  it('errors when bad id is sent', () => {
    return request(app)
      .get('/users/5')
      .then(res => expect(res.status).toEqual(500));
  });

  it('updates through patch', () => {
    return request(app)
      .patch(`/users/${user._id}`)
      .send({
        handle: user.handle,
        name: 'Blah Smitherson',
        email: 'smitherson@blah.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: user._id,
          handle: user.handle,
          name: 'Blah Smitherson',
          email: 'smitherson@blah.com',
          __v: 0
        });
      });
  });
});
