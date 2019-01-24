// require('dotenv').config();
// require('../lib/utils/connect')();
// const app = ('../lib/app');
// const mongoose = require('mongoose');
// const request = require('supertest');
// const Tweet = require('../lib/models/Tweet');
// const User = require('../lib/models/User');

// describe('tweets app', () => {
//   const createUser = (handle, name, email) => {
//     return User.create({ handle, name, email })
//       .then(user => ({ ...user, _id: user._id.toString() }));
//   };
  
//   const createTweet = (handle, text = 'a tweet') => {
//     return createUser(handle, 'jei', 'jj@gmail')
//       .then(user => {
//         return Tweet.create({ handle: user._id, text })
//           .then(tweet => ({ ...tweet, _id: tweet._id.toString() }));
//       });
//   };

//   beforeEach(done => {
//     return mongoose.connection.dropDatabase(() => {
//       done(); 
//     });
//   });
// });