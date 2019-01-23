const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    handle: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    text: {
        type: String,
        required: true,
        maxlength: 280
    }
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet; 
