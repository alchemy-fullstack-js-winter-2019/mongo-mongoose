const request = require('superagent');

const getQuotes = n => {
  return request
    .get(`https://ron-swanson-quotes.herokuapp.com/v2/quotes/${n}`)
    .then(res => res.body);
};

module.exports = {
  getQuotes
};