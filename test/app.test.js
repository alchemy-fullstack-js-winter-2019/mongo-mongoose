require('dotenv').config();
const connect = require('../lib/utils/connect');
const app = require('../lib/app');
const request = require('supertest');
// jest.mock('../lib/mock.js');

const mongoose = require('mongoose');
const createTweet = (handle) => {
    return createUser(handle)
        .then(createUser => {
            return request(app)
                .post('/tweets')
                .send({
                    handle: createUser._id,
                    text: 'dogs are the best'
                })
                .then(res => res.body);

        });
}; 

const createUser = (name) => {
    return request(app)
        .post('/users')
        .send({
            name,
            description: 'dogs are the best'
        })
        .then(res =>  res.body);
};

describe('tweets app', () => {
    beforeAll(() => {
        return connect();
    });

    beforeEach(done => {
        return mongoose.connection.dropDatabase(() => {
            done();
        });
    });
    afterAll((done) => {
        mongoose.connection.close(done);
    });
    it('sends a tweet', () => {
        return createUser('test user')
            .then(createdUser => {
                return request(app)
                    .post('/tweets')
                    .send({ handle: createdUser._id, text: 'first tweet' })
                    .then(res => {
                        expect(res.body).toEqual({ handle: createdUser._id, text: 'first tweet', _id: expect.any(String), __v: 0 });
                    });
            });
    });
    it('finds a list of tweets', () => {
        return Promise.all(['ryan', 'another handle'].map(createTweet))
            .then(() => {
                return request(app)
                    .get('/tweets');
            })
            .then(res => {
                expect(res.body).toHaveLength(2);
            });
    });
    it('deletes a tweet', () => {
        return createTweet('marcy1')
            .then(TweetWhoWasCreated => {
                return Promise.all([
                    Promise.resolve(TweetWhoWasCreated._id),
                    request(app) 
                        .delete(`/tweets/${TweetWhoWasCreated._id}`)
                ]);
            })
            .then(([_id, res]) => {
                expect(res.body).toEqual({ deleted: 1 });
                return request(app)
                    .get(`/tweets/${_id}`);
            });
    });
});
it('finds a tweet by ID and updates it', (done) => {
    return createTweet('marcy2')
        .then(tweetWhoWasCreated => {
            const id = tweetWhoWasCreated._id;
            const updatedObject = { handle: createUser._id, text: 'dogs are the best' };
            return request(app) 
                .patch(`/tweets/${id}`)
                .send(updatedObject);
        })
        .then(res => {
            expect(res.body).toEqual({ handle: expect.any(Object), text: 'dogs are the best', _id: expect.any(String) });
            done();
        });
        
});

it('errors when a bad id is sent', () => {
    return request(app)
        .get('/tweets/5c479e5d22e69952c13506a8')
        .then(res => {
            expect(res.status).toEqual(500);
        });
});
it('gets tweets by ID', () => {
    return createTweet('marcy1')
        .then(TweetWhoWasCreated => {
            return Promise.all([
                Promise.resolve(TweetWhoWasCreated._id),
                request(app)
                    .get(`/tweets/${TweetWhoWasCreated._id}`)
            ]);
        })
        .then(([_id, res]) => {
            expect(res.body).toEqual({ handle: expect.any(Object), text: 'dogs are the best', _id });
        });
});


