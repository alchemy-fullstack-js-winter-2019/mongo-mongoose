const request = require('superagent');

const getQuotes = n => {
  return request
    .get(`https://ron-swanson-quotes`)
    .then(res => res.body);
};
