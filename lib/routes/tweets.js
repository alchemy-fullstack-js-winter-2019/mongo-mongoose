const Tweets = require('../models/Tweet');
const mongoose = require('mongoose');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  const throwErrOrObj = (err, obj) => {
    err ? res.statusCode = 400 && res.end(JSON.stringify(err))
      : res.end(JSON.stringify(obj));
  };

  res.setHeader('Content-Type', 'application/json');

if(req.method === 'POST' && url.pathname.includes('/tweets')) {
  Tweets.create({
    handle: this.handle,
    text: this.text
  }, (throwErrOrObj));

} else if(req.method === 'GET' && url.pathname.includes('/tweets')) {
  Tweets.find((throwErrOrObj));
} else if(req.method === 'GET' && url.pathname.includes('/tweets')) {
  const id = url.pathname.slice(1).split('/')[1];
  Tweets.findById(id, (throwErrOrObj));
} else if(req.method === 'POST' && url.pathname.includes('/tweets')) {
  const id = url.pathname.slice(1).split('/')[1];
  Tweets.findByIdAndUpdate(id, {
    handle: this.handle,
    text: this.text
  }, (throwErrOrObj));
}

if(req.method === 'DELETE' && url.pathname.includes('/tweets')) {
  const id = url.pathname.slice(1).split('/')[1];
  Tweets.findByIdAndDelete(id, (throwErrOrObj));
}

};