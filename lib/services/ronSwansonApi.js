const request = require('superagent');

function getQuote(n) {
  return request
    .get(`https://ron-swanson-quotes.herokuapp.com/v2/quotes/${n}`)
    .then(req => req.quote);
}

module.exports = { getQuote };
