require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');

const createTweet = (handle) => {
    return request(app)
        .post('/tweets')
        .send({
            text: 'KAAACAHHH',
            handle: handle
        })
        .then(res => {
            return res.body;
        });
};

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
                expect(res.text).toContain('KananiBoy');
            });
    });


    it('it can find all documents in the DB', () => {
        const tweetsToCreate = ['YOLO', 'SWAG', 'FROSTYFINGERS420'];
        return Promise.all(tweetsToCreate.map(createTweet))
            .then(() => {
                return request(app)
                    .get('/tweets');
            })
            .then(res => {
                expect(res.body).toHaveLength(3);
            });
    });

    it('can find a document by id', () => {
        return createTweet('XRPMOON')
            .then(createdTweet => {
                return request(app)
                    .get(`/tweets/${createdTweet._id}`);
            })
            .then(res => {
                expect(res.text).toContain('XRPMOON');
            });
    });

    it('can update a document by ID', () => {
        return createTweet('BTCMOON')
            .then(createdTweet => {
                createdTweet.handle = 'NEOMOON';
                return request(app)
                    .put(`/tweets/${createdTweet._id}`)
                    .send(createdTweet);
            })
            .then(res => {
                expect(res.text).toContain('NEOMOON');
            });
    });
    //next it 
});