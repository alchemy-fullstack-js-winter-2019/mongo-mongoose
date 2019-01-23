/* eslint-disable no-empty */
const state = require('mongoose/lib/connectionstate');
const { HttpError } = require('../middleware/error');

module.exports = (err, req, res, next) => {
    if(state === state.connected || state === state.connecting) {
        next();
    } else if(err instanceof HttpError) {
        res.status(500).send('Mongo not connected');
        next();
    }
};
