require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  it('can create a new tweet', () => {
    return request(app)
    .post('/tweets')
    .send({
      handle: 'ryan',
      text: 'hello tweets'
    })
    .then(res => {
      expect(res.body).toEqual({
        handle: 'ryan',
        text: 'hello tweets',
        _id: expect.any(String).String,
        __v: 0
      })
    })
  })
})
