const { getQuotes } = require('../mock');

module.exports = (req, res, next) => {
    getQuotes(1)
        .then(quotes => {
            req.quote = quotes[0];
            next();
        })
        .catch(next);
};
