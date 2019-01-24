const request = require('superagent');

const getRandomQuote = n => {
  return request
    .get(`https://ron-swanson-quotes.herokuapp.com/v2/quotes/${n}`)
    .then(res => {
      return [res.body];
    });
};

console.log(getRandomQuote(1));

module.exports = { getRandomQuote };
