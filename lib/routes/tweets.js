const { Router } = require('express');
const Tweet = require('../models/Tweet');
// const { HttpError } = require('../);

module.exports = Router()

 .post('/', (req, res, next) => { 
   const { handle, text } = req.body; //destructoring req.body to get the handle and text
   Tweet
    .create({ handle, text })
    .then(tweet => res.send(tweet))
    .catch(next); //this catches any errors 

 })
 .get('/', (req, res, next) => {
   Tweet
    .find()
    .then(tweets => res.send(tweets))
    .catch(next);
 });

 