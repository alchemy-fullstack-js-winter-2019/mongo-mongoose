const { Router } = require('express');
const Tweets = require('../models/Tweet');
const { HttpError } = require('../middleware/error');


module.exports = Router()
    .post('/', (req, res, next) => {
        const { handle, text } = req.body;
        Tweets
            .create({ handle, text })
            .then(tweet => res.send(tweet))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Tweets
            .find()
            .then(tweets => res.send(tweets))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Tweets
            .findById(req.params.id)
            .then(foundTweet => {
                if(!foundTweet) {
                    return next(new HttpError(404, 'No Tweet Found'));
                }
                res.send(foundTweet);
            })
            .catch(next);

    })
    .patch('/:id', (req, res) => {
        Tweets.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedTweet) => {
            res.send(updatedTweet);
        });
    });