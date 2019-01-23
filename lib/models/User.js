const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true,
    maxlength: 30
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model('user', userSchema);
