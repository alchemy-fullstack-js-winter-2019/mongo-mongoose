require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');

const createUser = (handle, email, name) => {
    return User.create({ handle, email, name })
        .then(user => ({ ...user, _id: user._id.toString() }));
};

const createTweet = (handle, text = 'some tweet') => {
    return createUser(handle, 'lance', 'lance@lance.com')
        .then(user => {
            return Tweet.create({ handle: user._id, text })
                .then(tweet => ({ ...tweet, _id: tweet._id.toString() }));
        });

};


describe('test DB methods/routes', () => {
    beforeEach(done => {
        return mongoose.connection.dropDatabase(() => {
            done();
        });
    });
    afterAll((done) => {
        mongoose.connection.close(done);
    });
    

    it('can post the DB', () => {
        return createUser('KananiBoy', 'lance', 'lance@lance.com')
            .then(user => {
                return request(app)
                    .post('/tweets')
                    .send({ handle: user._id, text: 'SUUWOOP' })
                    .then(res => {
                        expect(res.body).toEqual({
                            handle: expect.any(String),
                            text: 'SUUWOOP',
                            _id: expect.any(String),
                            __v: 0
                        });
                    });
            });
    });


    it('it can find all documents in the DB', () => {
        const tweetsToCreate = ['hello', 'hey', 'hola'];
        return Promise.all(tweetsToCreate.map(createTweet))
            .then(() => {
                return request(app)
                    .get('/tweets');
            })
            .then(res => {
                expect(res.body).toHaveLength(3);
            });
    });


    it('gets a tweet by id', () => {
        return createTweet('XRPMOON')
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
                    text: 'some tweet',
                    _id
                });
            });
    });


    it('can update a document by ID', () => {
        return createTweet('XBT')
            .then(createdTweet => {
                return request(app)
                    .patch(`/tweets/${createdTweet._id}`)
                    .send({ text: 'NEOMOON' });
            })
            .then(res => {
                expect(res.text).toContain('NEOMOON');
            });
    });


    it('can delete a tweet by id', () => {
        return createTweet('XBT')
            .then(createdTweet => {
                return request(app)
                    .delete(`/tweets/${createdTweet._id}`);
            })
            .then(res => {
                expect(res.text).toContain('Deleted');
            });
    });

});