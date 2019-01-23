const { Router } = require('express');
const Tweet = require('../models/Tweet');



module.exports = Router()

Tweet
.create({ handle: 'Daffy-Duck', text: 'chicken al la kingpin' })
.then(createdTweet =>
  console.log(createdTweet))
.catch(err => console.error(err));
