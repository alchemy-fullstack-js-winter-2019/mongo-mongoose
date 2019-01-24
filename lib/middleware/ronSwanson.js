const { getRandomQuote } = require('../services/ronSwansonApi');

module.exports = (req, res, next) => {
  getRandomQuote(1)
    .then(([quote]) => {
      req.quote = quote;
      next();
    })
    .catch(next);
};
