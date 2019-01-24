require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');


const createUser = (handle) => {
    return request(app)
        .post('/users')
        .send({
            handle: handle,
            email: 'LOL@GMAIL.com',
            name: 'LANCE'
        })
        .then(res => {
            return res.body;
        });
};

describe('test user methods', () => {
    beforeEach(done => {
        return mongoose.connection.dropDatabase(() => {
            done();
        });
    });
    afterAll((done) => {
        mongoose.connection.close(done);
    });

    it('can post a new user to the DB', () => {
        return request(app)
            .post('/users')
            .send({ handle: 'KANANIBOY', email: 'LOL@GMAIL.com', name: 'LANCE' })
            .then(res => {
                expect(res.text).toContain('KANANIBOY');
            });
    });
    it('can get all users', () => {
        const usersToCreate = ['YOLO', 'SWAG', 'FROSTYFINGERS420'];
        return Promise.all(usersToCreate.map(createUser))
            .then(() => {
                return request(app)
                    .get('/users');
            })
            .then(res => {
                expect(res.body).toHaveLength(3);
            });
    });
    it('can get a user by id', () => {
        return createUser('DANKNASTY')
            .then(createdUser => {
                return request(app)
                    .get(`/users/${createdUser._id}`);
            })
            .then(res => {
                expect(res.body.handle).toEqual('DANKNASTY');
            });
    });
    it('can update a user', () => {
        return createUser('DANKNASTY')
            .then(createdUser => {
                return request(app)
                    .patch(`/users/${createdUser._id}`)
                    .send({ handle: 'FROSTYFINGERS420' });
            })
            .then(res => {
                expect(res.body.handle).toEqual('FROSTYFINGERS420');
            });
    });
    it.skip('can deleted a user by id', () => {
        return createUser('DANKNASTY')
            .then(createdUser => {
                return request(app)
                    .delete(`/users/${createdUser._id}`);
            })
            .then(res => {
                expect(res.body).toEqual({ deleted: true });
            });
    });
});