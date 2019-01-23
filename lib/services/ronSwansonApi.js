const request = require('superagent');

const getQuote = n => {
  return request
    .get(`https://ron-swanson-quotes.herokuapp.com/v2/${n}`)
    .then(res => {
      return [
        res.body
      ];
    });
};

module.exports = getQuote;
