const { Router } = require('express');
const Tweets = require('../../lib/models/Tweets');
const { HttpError } = require('../middleware/error');

const patcher = (body, fields) => {
    return Object.keys(body)
        .reduce((acc, key) => {
            if(fields.includes(key) && body[key]) {
                acc[key] = body[key];
            }
            return acc;
        }, {});
};
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
            .then(tweets => res.send(tweets))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Tweets.findByIdAndDelete(req.params.id)
            .then(() => res.send({ deleted: 1 }))
            .catch(next);
    })
    .patch('/:id', (req, res, next) => {
        const patched = patcher(req.body, ['handle', 'text']);
        Tweets.findByIdAndUpdate(req.params.id, patched,  { new: true })
            .select('-__v')
            .populate('handle', '-email -name -__v -_id')
            .then(updatedTweet => res.send(updatedTweet))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Tweets.findById(req.params.id)
            .select('-__v')
            .populate('handle', '-email -name -__v -_id')
            .then(foundTweet => {
                if(!foundTweet) {
                    return next(new HttpError(404, `No Tweet found with ${req.params.id}`));
                }
                res.send(foundTweet);
            })
            .catch(next);
    });


