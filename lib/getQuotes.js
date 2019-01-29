const request = require('superagent');

const getQuote = id => {
    return request
        .get(`http://ron-swanson-quotes.herokuapp.com/v2/quotes/${id}`)
        .then(res => res.body
        );
};
module.exports = {
    getQuote
};
