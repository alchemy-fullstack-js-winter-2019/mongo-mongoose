const { Router } = require('express');
const Users = require('../../lib/models/User');

module.exports = Router() 
    .post('/', (req, res, next) => {
        const { name, description } = req.body;
        Users.create({
            name,
            description
        }, (err, createdTweet) => {
            if(err) return next(err);
            res.send(createdTweet);
        });
    })
    .get('/', (req, res, next) => {
        Users.find((err, listOfUsers) => {
            res.send(listOfUsers);
        })
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Users.findByIdAndDelete(req.params.id, (err, deletedPerson) => {
            res.send(deletedPerson);
        })
            .catch(next);
    })
    .patch('/:id', (req, res, next) => {
        const { name, description } = req.body;
        Users.findByIdAndUpdate(req.params.id, {
            name,
            description
        }, { new: true }, (err, updatedPerson) => {
            res.send(updatedPerson);
        })
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        if(req.params.id) {
            Users.findById(req.params.id, (err, foundPerson) => {
                res.send(foundPerson);
            })
                .catch(next);
        }
    });

