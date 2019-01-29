const { getRandomQuote } = require('../services/ronSwansonApi');

module.exports = (req, res, next) => {
  getRandomQuote(1)
    .then(quotes => {
      req.quotes = quotes[0];
      next();
    })
    .catch(next);
};
