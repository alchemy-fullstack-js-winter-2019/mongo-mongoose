const { Router } = require('express');
const Users = require('../models/User');
const { HttpError } = require('../middleware/error');

module.exports = Router()
    .post('/', (req, res, next) => {
        const { handle, email, name } = req.body;
        Users.create({ handle, email, name })
            .then(user => res.send(user))
            .catch(next);

    })
    .get('/', (req, res, next) => {
        Users
            .find()
            .then(users => res.send(users))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Users
            .findById(req.params.id)
            .then(foundUser => {
                if(!foundUser) {
                    return next(new HttpError(404, 'No User Found'));
                }
                res.send(foundUser);
            })
            .catch(next);
    })
    .patch('/:id', (req, res, next) => {
        Users
            .findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(foundUser => {
                if(!foundUser) {
                    return next(new HttpError(404, 'No User Found'));
                }
                res.send(foundUser);
            })
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Users
            .findByIdAndDelete(req.params.id)
            .then(foundUser => {
                if(!foundUser) {
                    return next(new HttpError(404, 'No User Found'));
                }
                res.send({ deleted: true });
            })
            .catch(next);
    });
