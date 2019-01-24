const { Router } = require('express');
const Tweets = require('../models/Tweet');
const { HttpError } = require('../middleware/error');
const ronSwanSon = require('../middleware/ronSwanson');


module.exports = Router()
    .post('/', ronSwanSon, (req, res, next) => {
        const { handle, text } = req.body;

        if(req.query.random) {
            console.log(req.query.random);
            Tweets
                .create({ handle, text: req.quote })
                .then(tweet => res.send(tweet))
                .catch(next);
        } else {
            console.log('LOGS BODY TEXT', req.body)
            Tweets
                .create({ handle, text })
                .then(tweet => res.send(tweet))
                .catch(next);
        }
    })


    .get('/', (req, res, next) => {
        Tweets
            .find()
            .select('-__v')
            .populate('handle', '-email -name -_id -__v')
            .then(tweets => res.send(tweets))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Tweets
            .findById(req.params.id)
            .select('-__v')
            .populate('handle', '-email -name -_id -__v')
            .then(foundTweet => {
                if(!foundTweet) {
                    return next(new HttpError(404, 'No Tweet Found'));
                }
                res.send(foundTweet);
            })
            .catch(next);
    })

    

    .patch('/:id', (req, res, next) => {
        Tweets
            .findByIdAndUpdate(req.params.id, req.body, { new: true })
            .select('-__v')
            .populate('handle', '-email -name -_id -__v')
            .then(updatedTweet => res.send(updatedTweet))
            .catch(next);

    })



    
    .delete('/:id', (req, res, next) => {
        Tweets.findByIdAndDelete(req.params.id)
            .select('-__v')
            .populate('handle', '-email -name -_id -__v')
            .then(foundTweet => {
                if(!foundTweet) {
                    return next(new HttpError(404, 'No Tweet Found'));
                }
                res.send('Deleted: true');
            })
            .catch(next);
    });