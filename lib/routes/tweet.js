const { Router } = require('express');
const Tweets = require('../../lib/models/Tweets');

module.exports = Router() 
    .post('/', (req, res, next) => {
        const { handle, text } = req.body;
        Tweets.create({
            handle,
            text
        })
            .then(createdTweet => res.send(createdTweet))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Tweets.find()
            .populate()
            .then(tweets => res.send(tweets))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Tweets.findByIdAndDelete(req.params.id)
            .populate()
            .then(deletedTweet => res.send(deletedTweet))
            .catch(next);
    })
    .patch('/:id', (req, res, next) => {
        const { handle, text } = req.body;
        Tweets.findByIdAndUpdate(req.params.id, {
            handle,
            text
        }, { new: true })
            .populate()
            .then(updatedTweet => res.send(updatedTweet))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Tweets.findById(req.params.id)
            .populate()
            .then(foundTweet => res.send(foundTweet))
            .catch(next);
    });

