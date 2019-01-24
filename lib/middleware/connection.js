/* eslint-disable no-empty */
const state = require('mongoose/lib/connectionstate');
const { HttpError } = require('../middleware/error');
const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    if(mongoose.connection.readyState === state.connected || mongoose.connection.readyState === state.connecting) {
        next();
    } else  {
        next(new HttpError(500, 'Cannot connect to MongoDB'));
    }
};
