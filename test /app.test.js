require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => { 
    done();
  });
  });
  it('creates a new tweet', () => {
    return request(app)
      .post('/tweets')
      .send({ handle: 'mike', text: 'my 1st tweet' })
      .then(res => {
        // console.log('banana', res);
        expect(res.body).toEqual({
          handle: 'mike',
          text: 'my 1st tweet',
          _id: expect.any(String)
        });
      });
  });
});