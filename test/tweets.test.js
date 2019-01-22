require('dotenv').config();
require('./lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');

describe('test DB methods/routes', () => {
    beforeEach(done => {
        return mongoose.connection.dropDatabase(() => {
            done();
        });
    });
    it('can post the DB', () => {
        return request(app)
            .post('/tweets')
            .send({ handle: 'KananiBoy', text: 'SUUWOOP' })
            .then(res => {
                expect(res.body).toContain('KananiBoy');
            });
    });
});