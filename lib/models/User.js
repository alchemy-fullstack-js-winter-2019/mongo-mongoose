const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 281
  },
  email: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('User', userSchema)
