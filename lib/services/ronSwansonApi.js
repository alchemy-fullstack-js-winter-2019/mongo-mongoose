const request  = require('superagent');

const getQuote = (n) => {
    return request 
        .get(`https://ron-swanson-quotes.herokuapp.com/v2/quotes/${n}`)
        .then(res => {
            return [res.body];
        });
};


console.log(getQuote(5));

module.exports = getQuote;