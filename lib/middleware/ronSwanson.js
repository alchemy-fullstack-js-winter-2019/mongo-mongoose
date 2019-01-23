const { getRandomQuote } = require('../services/ronSwansonApi');

module.exports = (req, res, next) => {
  getRandomQuote(1)
    .then(quotes => {
      req.quote = quotes[0];
      next();
    })
    .catch(next);
};
