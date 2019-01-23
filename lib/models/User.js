const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/tweets', { useNewUrlParser: true });

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
