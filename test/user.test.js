require('dotenv').config();
require('../lib/utils/connect')();
const app = require('../lib/app');
const request = require('supertest');
const mongoose = require('mongoose');

const createUser = (name) => {
    return request(app)
        .post('/users')
        .send({
            name: name,
            description: 'dogs are the best'
        })
        .then(res => res.body);
};

describe('users app', () => {
    beforeEach(done => {
        return mongoose.connection.dropDatabase(() => {
            done();
        });
    });
    it('sends a user', () => {
        return request(app)
            .post('/users')
            .send({ name: 'jeffery', description: 'tall' })
            .then(res => {
                expect(res.body).toEqual({ name: 'jeffery', description: 'tall', _id: expect.any(String), __v: 0 });
            });
    }); 
    it('gets all the users', () => {
        return Promise.all(['marcy2', 'marcy3'].map(createUser))
            .then(() => {
                return request(app)
                    .get('/users');
            })
            .then(res => {
                expect(res.body).toHaveLength(2);
            });
    });
    it('deletes a user', () => {
        return createUser('gunther')
            .then(personWhoWasCreated => {
                const id = personWhoWasCreated._id;
                return request(app) 
                    .delete(`/users/${id}`)
                    .then(res => {
                        expect(res.status).toEqual(200);
                    });
            });
    });
    it('updates by id', () => {
        return createUser('gunther')
            .then(personWhoWasCreated => {
                const id = personWhoWasCreated._id;
                const updatedObject = ({ name: 'pudding', description: 'dogs are the best' });
                return request(app) 
                    .patch(`/users/${id}`)
                    .send(updatedObject)
                    .then(res => {
                        expect(res.body).toEqual({ name: 'pudding', description: 'dogs are the best', _id: expect.any(String), __v: 0 });
                    });
        
            });

    });
    it('gets person by ID', () => {
        return createUser('gunther')
            .then(personWhoWasCreated => {
                const id = personWhoWasCreated._id;
                return request(app)
                    .get(`/users/${id}`)
                    .then(res => {
                        expect(res.body).toEqual({ name: 'gunther', description: 'dogs are the best', _id: expect.any(String), __v: 0 });
                    });
            });
    });
});
