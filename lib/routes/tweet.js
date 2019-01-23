const { Router } = require('express');
const Tweets = require('../../lib/models/Tweets');

module.exports = Router() 
    .post('/', (req, res, next) => {
        const { handle, text } = req.body;
        Tweets.create({
            handle,
            text
        }, (err, createdTweet) => {
            res.send(createdTweet);
        })
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Tweets.find((err, listOfTweets) => {
            res.send(listOfTweets);
        })
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Tweets.findByIdAndDelete(req.params.id, (err, deletedTweet) => {
            res.send(deletedTweet);
        })
            .catch(next);
    })
    .patch('/:id', (req, res, next) => {
        const { handle, text } = req.body;
        Tweets.findByIdAndUpdate(req.params.id, {
            handle,
            text
        }, { new: true }, (err, updatedTweet) => {
            res.send(updatedTweet);
        })
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        if(req.params.id) {
            Tweets.findById(req.params.id, (err, foundTweet) => {
                // if(err) {
                //     if(err.code === 'ENOENT') {
                //         return next(new HttpError(400, `Bad Id: ${req.params.id}`));
                //     } else {
                //         return next(err);
                //     }
                // }
                res.send(foundTweet);
            })
                .catch(next);
        }
    });

