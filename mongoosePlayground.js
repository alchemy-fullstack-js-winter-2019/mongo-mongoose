const mongoose = require('mongoose');

mongoose.connect('mongodb://172.17.0.i2.27017/tweets', {
  useNewUrlParser: true
});