require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/ronSwansonApi.js');

describe('app', () => {

  it('errors when tries to get bad path', () => {
    return request(app)
      .get('/butter')
      .then(res => {
        expect(res.status).toEqual(404);
        expect(res.body).toEqual({ error: 'Sorry, /butter was not found!' });
      });
  });

  it('can return a random ronSwansonQuote', () => {
    return request(app)
      .get('/random')
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(['I wanna punch you in the face so bad right now.']);
      });
  });

  it('can return a homepage message', () => {
    return request(app)
      .get('/')
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.text).toEqual('Welcome to Cari\'s amazing Mongo Half Stack App');
      });
  });
});
