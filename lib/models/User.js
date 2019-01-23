const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  handle: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true,
    maxlength: 280
  },
  email: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model('User', userSchema);

