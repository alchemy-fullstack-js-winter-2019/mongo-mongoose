const request = require('superagent');

const getRandomQuote = n => {
  return request
    .get(`https://ron-swanson-quotes.herokuapp.com/v2/quotes/${n}`)
    .then(res => {
      return [res.body];
    });
};

module.exports = { getRandomQuote };
