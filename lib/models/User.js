const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    }
});

const Tweet = mongoose.model('User', userSchema);

module.exports = Tweet; 
