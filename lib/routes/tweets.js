const { Router } = require('express');
const Tweet = require('../models/Tweet');
// const { HttpError } = require('../);

module.exports = Router()

 .post('/', (req, res, next) => { 
   const { handle, text } = res.body; //destructoring req.body to get the handle and text
   Tweet.create({ //we create a new tweet
     handle,
     text
   })
   .then(createdTweet => { //this is a promise
     res.send(createdTweet);
   })
   .catch(next); //this catches any errors 

 })

 