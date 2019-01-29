const mongoose = require('mongoose');
// require('dotenv').config();
// require('./lib/utils/connect')();

// mongoose.connect('mongodb://127.0.0.1:27017/test', {
//   useNewUrlParser: true
// });

// const testSchema = new mongoose.Schema({
//   handle: {
//     // type: mongoose.Schema.Types.ObjectId,
//     // ref: 'Test2',
//     type: String,
//     required: true
//   },
//   text: {
//     type: String,
//     required: true
//   }
// });

// const Test = mongoose.model('Test', testSchema);

// Test
//   .create({ handle: 'bob', text: 'bob tweets' })
//   .then(test => {
//     console.log('test1', test);
//     mongoose.disconnect();
//   });

mongoose.connect('mongodb://127.0.0.1:27017/test2', {
  useNewUrlParser: true
});

const test2Schema = new mongoose.Schema({
  handle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const Test2 = mongoose.model('Test2', test2Schema);
Test2
  .create({ name: 'Jane Smith' })
  .then(test => {
    console.log('test2', test);
    mongoose.disconnect();
  });
