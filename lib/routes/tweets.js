const { 
    Router,
} = require('express');
const Tweets = require('../models/Tweet');

module.exports = Router()
    .post('/', (req, res, next) => {
        const { handle, text } = req.body;
        Tweets.create({
            handle, 
            text
        }, 
        (err, createdTweet) => {
            res.send(createdTweet);
        });
    })
    .get('/', (req, res) => {
        Tweets.find((err, listOfTweets) => {
            res.send(listOfTweets);
        });
    })
    .get('/:id', (req, res) => {
        Tweets.findById(req.params.id, (err, foundTweet) => {
            res.send(foundTweet);
        });
    })
    .put('/:id', (req, res) => {
        Tweets.findByIdAndUpdate(req.params.id, req.body,{ new: true }, (err, updatedTweet) => {
            res.send(updatedTweet);
        });
    });