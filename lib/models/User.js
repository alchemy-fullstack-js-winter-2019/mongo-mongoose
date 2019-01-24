const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    handle: {
        type: String, 
        require: true

    },
    email: {
        type: String, 
        require: true

    },
    name: {
        type: String, 
        require: true

    },
    text: {
        type: String, 
        require: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;